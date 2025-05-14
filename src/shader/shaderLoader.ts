export async function InitShaderProgram(gl: WebGL2RenderingContext, vertexShaderPath: string, fragmentShaderPath: string): Promise<WebGLProgram | null>
{
    const vertexShaderPromise = LoadShader(gl, gl.VERTEX_SHADER, vertexShaderPath);
    const fragmentShaderPromise = LoadShader(gl, gl.FRAGMENT_SHADER, fragmentShaderPath);

    const [vertexShader, fragmentShader] = await Promise.all([vertexShaderPromise, fragmentShaderPromise]);

    if (vertexShader === null || fragmentShader === null)
    {
        console.log('Null shader');
        return null;
    }

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    {
        console.log(`Unable to initialize the shader program: ${gl.getProgramInfoLog(program)}`);
        gl.deleteProgram(program);
        return null;
    }

    return program;
}

async function LoadShader(gl: WebGL2RenderingContext, type: number, path: string): Promise<WebGLShader | null>
{
    if (!(type === gl.VERTEX_SHADER || type === gl.FRAGMENT_SHADER))
    {
        console.log('Invalid type');
        return null;
    }

    const shader = gl.createShader(type);

    if (shader === null)
    {
        console.log('Could not create shader');
        return null;
    }
    
    const source = await LoadShaderData(path);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    {
        console.log(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

async function LoadShaderData(path: string): Promise<string>
{
    const response = await fetch(path);

    if (!response.ok)
    {
        throw new Error(`Failed to load shader at ${path}: ${response.statusText}`);
    }

    const shaderText = await response.text();
    
    return shaderText;
}