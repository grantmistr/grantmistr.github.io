export abstract class ProgramInfo
{
    public readonly program: WebGLProgram;

    public constructor(gl: WebGL2RenderingContext, program: WebGLProgram)
    {
        this.program = program;
    }
    
    protected abstract ProgramLogic(gl: WebGL2RenderingContext): void;

    public readonly Execute = (gl: WebGL2RenderingContext): void =>
    {
        this.ProgramLogic(gl);
    };
}