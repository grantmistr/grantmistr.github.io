import { Camera } from "../camera.js";
import { Uniforms } from "../webGL.js";

export abstract class ProgramInfo
{
    public readonly program: WebGLProgram;

    public constructor(program: WebGLProgram)
    {
        this.program = program;
    }

    protected abstract UpdateUniforms(gl: WebGL2RenderingContext, uniforms: Uniforms, camera: Camera): void;
    
    protected abstract ProgramLogic(gl: WebGL2RenderingContext): void;

    public OnResize(e: UIEvent, uniforms: Uniforms, camera: Camera): void {}

    public OnMouseMove(e: MouseEvent, uniforms: Uniforms, camera: Camera): void {}

    public OnMouseDown(e: MouseEvent, uniforms: Uniforms): void {}

    public OnMouseUp(e: MouseEvent, uniforms: Uniforms): void {}

    public readonly Execute = (gl: WebGL2RenderingContext, uniforms: Uniforms, camera: Camera): void =>
    {
        gl.useProgram(this.program);
        this.UpdateUniforms(gl, uniforms, camera);
        this.ProgramLogic(gl);
    };
}