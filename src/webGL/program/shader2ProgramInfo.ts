import { Uniforms } from "../../pageManager/pageManager.js";
import { ProgramInfo } from "./programInfo.js";

export class Shader2ProgramInfo extends ProgramInfo
{
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
        super(gl, program);

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
    }

    protected UpdateUniforms(gl: WebGL2RenderingContext, uniforms: Uniforms): void
    {
        gl.uniform1f(this.uLoc.time, uniforms.time);
        gl.uniform1f(this.uLoc.mouseClickTime, uniforms.mouseClickTime);
        gl.uniform2f(this.uLoc.screenSize, uniforms.screenSize[0], uniforms.screenSize[1]);
        gl.uniform2f(this.uLoc.mousePosition, uniforms.mousePosition[0], uniforms.mousePosition[1]);
        gl.uniform2f(this.uLoc.mouseClickPosition, uniforms.mouseClickPosition[0], uniforms.mouseClickPosition[1]);
    }

    protected ProgramLogic(gl: WebGL2RenderingContext): void
    {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.drawArrays(gl.TRIANGLES, 0, this.vertCount);
    }
}