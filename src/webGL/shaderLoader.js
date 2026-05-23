export async function InitShaderProgram(gl, vertexShaderPath, fragmentShaderPath) {
    const vertexShaderPromise = LoadShader(gl, gl.VERTEX_SHADER, vertexShaderPath);
    const fragmentShaderPromise = LoadShader(gl, gl.FRAGMENT_SHADER, fragmentShaderPath);
    const [vertexShader, fragmentShader] = await Promise.all([vertexShaderPromise, fragmentShaderPromise]);
    if (vertexShader === null || fragmentShader === null) {
        console.log('Null shader');
        return null;
    }
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log(`Unable to initialize the shader program: ${gl.getProgramInfoLog(program)}`);
        gl.deleteProgram(program);
        return null;
    }
    return program;
}
async function LoadShader(gl, type, path) {
    if (!(type === gl.VERTEX_SHADER || type === gl.FRAGMENT_SHADER)) {
        console.log('Invalid type');
        return null;
    }
    const shader = gl.createShader(type);
    if (shader === null) {
        console.log('Could not create shader');
        return null;
    }
    const source = await LoadShaderData(path);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}
async function LoadShaderData(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Failed to load shader at ${path}: ${response.statusText}`);
    }
    let shaderText = await response.text();
    shaderText = await InjectIncludes(shaderText, path);
    return shaderText;
}
async function InjectIncludes(shaderText, path) {
    /**
     * <full include path, the index of the loaded text in include chunks array>
     */
    const loadedIncludes = new Map(null);
    /**
     * which index in include chunks array to use
     */
    const includeMap = new Map(null);
    let includeIndex = 0;
    const regex = /^[ \t]*#include\s+"(.+?)"/gm;
    // find all lines in the shader with #include "..."
    // stuff in quotes in first group (relative file path)
    const includeMatches = shaderText.matchAll(regex);
    includeMatches.forEach((includeMatch, index) => {
        const fullMatch = includeMatch[0].valueOf();
        const relativePath = includeMatch[1].valueOf();
        let searchPath = "";
        // if root path don't need to do anything else
        if (relativePath.startsWith("./")) {
            searchPath = relativePath;
        }
        // if relative, modify to be a full path from root
        else {
            const splitPath = relativePath.split("../");
            const count = path.split("/").length - splitPath.length;
            const prependPath = path.match(new RegExp(String.raw `^(?:[^\/]*\/){${count}}`));
            if (prependPath !== null) {
                searchPath = prependPath[0].valueOf().concat(splitPath[splitPath.length - 1]);
            }
        }
        // add the file path to a map so that it doesn't get fetched multiple times
        // also map the original #include "..." string to the index to make things easier
        if (loadedIncludes.has(searchPath)) {
            includeMap.set(fullMatch, loadedIncludes.get(searchPath));
        }
        else {
            loadedIncludes.set(searchPath, includeIndex);
            includeMap.set(fullMatch, includeIndex);
            includeIndex++;
        }
    });
    // no includes found 
    if (includeIndex < 1) {
        return shaderText;
    }
    // array that holds the text of the loaded include files
    const includeChunks = new Array(includeIndex);
    // fetch all includes and assign to chunks array; wait until all are finished
    const includeChunkPromises = Array.from(loadedIncludes, async ([includePath, includeChunkIndex]) => {
        const response = await fetch(includePath);
        if (!response.ok) {
            throw new Error(`Failed to load shader include at ${includePath}: ${response.statusText}`);
        }
        const text = await response.text();
        includeChunks[includeChunkIndex] = text;
    });
    await Promise.all(includeChunkPromises);
    // replace each include line with correct chunk
    // TODO : optimize so don't have to regex again
    // string.match returns the char index where the match starts, could cache
    // ex: index 116-139 maps to index 0 in chunks array
    shaderText = shaderText.replace(regex, (fullMatch) => {
        const chunkIndex = includeMap.get(fullMatch);
        if (chunkIndex !== undefined) {
            return includeChunks[chunkIndex];
        }
        return "";
    });
    return shaderText;
}
