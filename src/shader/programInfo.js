export class ProgramInfo {
    program;
    constructor(program) {
        this.program = program;
    }
    Execute = (gl, uniforms) => {
        gl.useProgram(this.program);
        this.UpdateUniforms(gl, uniforms);
        this.ProgramLogic(gl);
    };
}
export class Shader0ProgramInfo extends ProgramInfo {
    vertexIDBuffer;
    vertCount = 3;
    aLoc;
    uLoc;
    constructor(gl, program) {
        super(program);
        this.aLoc =
            {
                vertexID: gl.getAttribLocation(program, 'inVertexID')
            };
        this.uLoc =
            {
                time: gl.getUniformLocation(program, 'uTime'),
                screenSize: gl.getUniformLocation(program, 'uScreenSize')
            };
        this.vertexIDBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexIDBuffer);
        let vertexIDData = new Array(this.vertCount);
        for (let i = 0; i < this.vertCount; i++) {
            vertexIDData[i] = i;
        }
        gl.bufferData(gl.ARRAY_BUFFER, new Int32Array(vertexIDData), gl.STATIC_DRAW);
    }
    UpdateUniforms(gl, uniforms) {
        gl.uniform1f(this.uLoc.time, uniforms.time);
        gl.uniform2f(this.uLoc.screenSize, uniforms.screenSize.x, uniforms.screenSize.y);
    }
    ProgramLogic(gl) {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.enableVertexAttribArray(this.aLoc.vertexID);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexIDBuffer);
        const size = 1;
        const type = gl.INT;
        const stride = 0;
        const offset = 0;
        gl.vertexAttribIPointer(this.aLoc.vertexID, size, type, stride, offset);
        gl.drawArrays(gl.TRIANGLES, 0, this.vertCount);
        gl.disableVertexAttribArray(this.aLoc.vertexID);
    }
}
export class Shader1ProgramInfo extends ProgramInfo {
    vertexIDBuffer;
    vertCount = 3;
    aLoc;
    uLoc;
    constructor(gl, program) {
        super(program);
        this.aLoc =
            {
                vertexID: gl.getAttribLocation(program, 'inVertexID')
            };
        this.uLoc =
            {
                time: gl.getUniformLocation(program, 'uTime'),
                screenSize: gl.getUniformLocation(program, 'uScreenSize'),
                mousePosition: gl.getUniformLocation(program, 'uMousePosition')
            };
        this.vertexIDBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexIDBuffer);
        let vertexIDData = new Array(this.vertCount);
        for (let i = 0; i < this.vertCount; i++) {
            vertexIDData[i] = i;
        }
        gl.bufferData(gl.ARRAY_BUFFER, new Int32Array(vertexIDData), gl.STATIC_DRAW);
    }
    UpdateUniforms(gl, uniforms) {
        gl.uniform1f(this.uLoc.time, uniforms.time);
        gl.uniform2f(this.uLoc.screenSize, uniforms.screenSize.x, uniforms.screenSize.y);
        gl.uniform2f(this.uLoc.mousePosition, uniforms.mousePosition.x, uniforms.mousePosition.y);
    }
    ProgramLogic(gl) {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.enableVertexAttribArray(this.aLoc.vertexID);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexIDBuffer);
        const size = 1;
        const type = gl.INT;
        const stride = 0;
        const offset = 0;
        gl.vertexAttribIPointer(this.aLoc.vertexID, size, type, stride, offset);
        gl.drawArrays(gl.TRIANGLES, 0, this.vertCount);
        gl.disableVertexAttribArray(this.aLoc.vertexID);
    }
}
