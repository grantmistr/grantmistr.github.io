import { ProgramInfo } from "./program/programInfo.js";

export class GLCTX
{
    public gl: WebGL2RenderingContext | null = null;
    public canvas: HTMLCanvasElement | null = null;

    public Initialize(): void
    {
        this.canvas = document.querySelector<HTMLCanvasElement>('#webGLCanvas');

        if (this.canvas === null)
        {
            console.log("Canvas Null");
            return;
        }

        this.gl = this.canvas.getContext("webgl2");

        if (this.gl === null)
        {
            console.log("WebGL2RenderingContext Null");
            return;
        }

        this.gl.canvas.width = window.innerWidth;
        this.gl.canvas.height = window.innerHeight;

        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }

    public OnResize(): void
    {
        this.gl!.canvas.width = window.innerWidth;
        this.gl!.canvas.height = window.innerHeight;
    }

    public Draw(programInfo: ProgramInfo): void
    {
        if (this.gl !== null && programInfo !== null)
        {
            programInfo.Execute(this.gl);
        }
    }

    public SetActiveProgram(programInfo: ProgramInfo): void
    {
        if (this.gl !== null && programInfo !== null)
        {
            this.gl.useProgram(programInfo.program);
        }
    }
}
