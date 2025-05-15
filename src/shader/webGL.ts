import { ProgramInfo } from "./programInfo.js";

export class Uniforms
{
    public time: number = 0.0;
    public screenSize = 
    {
        x: 0.0,
        y: 0.0
    };
    public mousePosition =
    {
        x: 0.0,
        y: 0.0
    };

    public Update(timeSinceLoad: number): void
    {
        this.time = timeSinceLoad;
    }
}

class GLCTX
{
    public gl: WebGL2RenderingContext | null = null;
    public programInfo: ProgramInfo | null = null;
    public uniforms: Uniforms = new Uniforms();

    public Initialize(canvas: HTMLCanvasElement): void
    {
        this.gl = canvas.getContext("webgl2");

        if (this.gl === null)
        {
            console.log("WebGL2RenderingContext Null");
            return;
        }

        this.gl.canvas.width = window.innerWidth;
        this.gl.canvas.height = window.innerHeight;

        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.uniforms.screenSize.x = window.innerWidth;
        this.uniforms.screenSize.y = window.innerHeight;

        window.addEventListener('resize', () => 
        {
            if (this.gl !== null)
            {
                this.gl.canvas.width = window.innerWidth;
                this.gl.canvas.height = window.innerHeight;
            }

            this.uniforms.screenSize.x = window.innerWidth;
            this.uniforms.screenSize.y = window.innerHeight;
        });

        window.addEventListener('mousemove', (e: MouseEvent) =>
        {
            this.uniforms.mousePosition.x = e.clientX;
            this.uniforms.mousePosition.y = e.clientY;
        });
    }

    public Update(timeSinceLoad: number): void
    {
        this.uniforms.Update(timeSinceLoad);
        this.DrawScene();
    }

    private DrawScene(): void
    {
        if (this.programInfo !== null && this.gl !== null)
        {
            this.programInfo.Execute(this.gl, this.uniforms);
        }
    }
}

function Render(timeSinceLoad: number): void
{
    gl.Update(timeSinceLoad);
    requestAnimationFrame(Render);
}

export function StartRender(): void
{
    Render(0.0);
}

export const gl: GLCTX = new GLCTX();