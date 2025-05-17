import { Uniforms } from "./webGL.js";

export abstract class ProgramInfo
{
    public readonly program: WebGLProgram;

    public constructor(program: WebGLProgram)
    {
        this.program = program;
    }

    protected abstract UpdateUniforms(gl: WebGL2RenderingContext, uniforms: Uniforms): void;
    
    protected abstract ProgramLogic(gl: WebGL2RenderingContext): void;

    public readonly Execute = (gl: WebGL2RenderingContext, uniforms: Uniforms): void =>
    {
        gl.useProgram(this.program);
        this.UpdateUniforms(gl, uniforms);
        this.ProgramLogic(gl);
    };
}

export class Shader0ProgramInfo extends ProgramInfo
{
    private vertexIDBuffer: WebGLBuffer;
    private vertCount: GLuint = 3;

    private aLoc:
    {
        vertexID: GLint
    };

    private uLoc:
    {
        time: WebGLUniformLocation | null,
        screenSize: WebGLUniformLocation | null
    };

    public constructor(gl: WebGL2RenderingContext, program: WebGLProgram)
    {
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

        let vertexIDData: Array<GLint> = new Array<GLint>(this.vertCount);
        for (let i: GLint = 0; i < this.vertCount; i++)
        {
            vertexIDData[i] = i;
        }

        gl.bufferData(gl.ARRAY_BUFFER, new Int32Array(vertexIDData), gl.STATIC_DRAW);
    }

    protected UpdateUniforms(gl: WebGL2RenderingContext, uniforms: Uniforms): void
    {
        gl.uniform1f(this.uLoc.time, uniforms.time);
        gl.uniform2f(this.uLoc.screenSize, uniforms.screenSize.x, uniforms.screenSize.y);
    }

    protected ProgramLogic(gl: WebGL2RenderingContext): void
    {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.enableVertexAttribArray(this.aLoc.vertexID);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexIDBuffer);
        
        const size: GLint = 1;
        const type: GLenum = gl.INT;
        const stride: GLsizei = 0;
        const offset: GLintptr = 0;
        gl.vertexAttribIPointer(this.aLoc.vertexID, size, type, stride, offset);
        
        gl.drawArrays(gl.TRIANGLES, 0, this.vertCount);

        gl.disableVertexAttribArray(this.aLoc.vertexID);
    }
}

export class Shader1ProgramInfo extends ProgramInfo
{
    private vertexIDBuffer: WebGLBuffer;
    private vertCount: GLuint = 3;

    private aLoc:
    {
        vertexID: GLint
    };

    private uLoc:
    {
        time: WebGLUniformLocation | null,
        mouseClickTime: WebGLUniformLocation | null,
        screenSize: WebGLUniformLocation | null,
        mousePosition: WebGLUniformLocation | null,
        mouseClickPosition: WebGLUniformLocation | null
    };

    public constructor(gl: WebGL2RenderingContext, program: WebGLProgram)
    {
        super(program);

        this.aLoc =
        {
            vertexID: gl.getAttribLocation(program, 'inVertexID')
        };

        this.uLoc =
        {
            time: gl.getUniformLocation(program, 'uTime'),
            mouseClickTime: gl.getUniformLocation(program, 'uMouseClickTime'),
            screenSize: gl.getUniformLocation(program, 'uScreenSize'),
            mousePosition: gl.getUniformLocation(program, 'uMousePosition'),
            mouseClickPosition: gl.getUniformLocation(program, 'uMouseClickPosition')
        };

        this.vertexIDBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexIDBuffer);

        let vertexIDData: Array<GLint> = new Array<GLint>(this.vertCount);
        for (let i: GLint = 0; i < this.vertCount; i++)
        {
            vertexIDData[i] = i;
        }

        gl.bufferData(gl.ARRAY_BUFFER, new Int32Array(vertexIDData), gl.STATIC_DRAW);
    }

    protected UpdateUniforms(gl: WebGL2RenderingContext, uniforms: Uniforms): void
    {
        gl.uniform1f(this.uLoc.time, uniforms.time);
        gl.uniform1f(this.uLoc.mouseClickTime, uniforms.mouseClickTime);
        gl.uniform2f(this.uLoc.screenSize, uniforms.screenSize.x, uniforms.screenSize.y);
        gl.uniform2f(this.uLoc.mousePosition, uniforms.mousePosition.x, uniforms.mousePosition.y);
        gl.uniform2f(this.uLoc.mouseClickPosition, uniforms.mouseClickPosition.x, uniforms.mouseClickPosition.y);
    }

    protected ProgramLogic(gl: WebGL2RenderingContext): void
    {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.enableVertexAttribArray(this.aLoc.vertexID);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexIDBuffer);
        
        const size: GLint = 1;
        const type: GLenum = gl.INT;
        const stride: GLsizei = 0;
        const offset: GLintptr = 0;
        gl.vertexAttribIPointer(this.aLoc.vertexID, size, type, stride, offset);
        
        gl.drawArrays(gl.TRIANGLES, 0, this.vertCount);

        gl.disableVertexAttribArray(this.aLoc.vertexID);
    }
}