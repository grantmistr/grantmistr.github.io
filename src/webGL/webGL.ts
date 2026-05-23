import { Camera } from "./camera.js";
import { ProgramInfo } from "./program/programInfo.js";
import { Shader3ProgramInfo } from "./program/shader3ProgramInfo.js";
import { InitShaderProgram } from "./shaderLoader.js";
import { SceneConstants } from "./constants.js";

export class Uniforms
{
    public time: number = 0.0;
    public deltaTime: number = 0.0;
    public mouseClickTime: number = 0.0;
    public mouseDown: boolean = false;
    public screenSize: [number, number] = [0, 0];
    public aspectRatio: number = 1.0;
    public mousePosition: [number, number] = [0, 0];
    public mouseClickPosition: [number, number] = [0, 0];
    public mouseDelta: [number, number] = [0, 0];

    public UpdateTime(timeSinceLoad: number): void
    {
        this.deltaTime = timeSinceLoad - this.time;
        this.time = timeSinceLoad;
    }
}

class GLCTX
{
    public readonly TARGET_FPS: number = 100.0;
    public readonly TARGET_MS: number = 1000.0 / this.TARGET_FPS;

    public gl: WebGL2RenderingContext | null = null;
    public canvas: HTMLCanvasElement | null = null;
    public programInfo: ProgramInfo | null = null;
    public programInfos: ProgramInfo[] = new Array<ProgramInfo>(0);
    public uniforms: Uniforms = new Uniforms();
    public currentFrame: number = 0;
    public prevFrameTime: number = 0.0;
    public camera: Camera = new Camera(
        SceneConstants.CAMERA_NEAR,
        SceneConstants.CAMERA_FAR,
        SceneConstants.CAMERA_FOV,
        window.innerWidth / window.innerHeight,
        [0.0, 0.0, -SceneConstants.CAMERA_DISTANCE],
        [0.0, 0.0, 0.0]
    );

    public Initialize(canvas: HTMLCanvasElement): void
    {
        this.gl = canvas.getContext("webgl2");
        this.canvas = canvas;

        if (this.gl === null || this.canvas === null)
        {
            console.log("WebGL2RenderingContext Null");
            return;
        }

        this.gl.canvas.width = window.innerWidth;
        this.gl.canvas.height = window.innerHeight;

        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.uniforms.screenSize = [window.innerWidth, window.innerHeight];
        this.uniforms.aspectRatio = window.innerWidth / window.innerHeight;
        this.camera.UpdateProjectionMatrix(this.uniforms.aspectRatio);

        window.addEventListener('resize', (e: UIEvent) => 
        {
            this.gl!.canvas.width = window.innerWidth;
            this.gl!.canvas.height = window.innerHeight;
            this.uniforms.screenSize = [window.innerWidth, window.innerHeight];
            this.uniforms.aspectRatio = window.innerWidth / window.innerHeight;
            this.camera.UpdateProjectionMatrix(this.uniforms.aspectRatio);

            if (this.programInfo !== null)
            {
                this.programInfo.OnResize(e, this.uniforms, this.camera);
            }
        });

        window.addEventListener('mousemove', (e: MouseEvent) =>
        {
            const rect = this.canvas!.getBoundingClientRect();

            this.uniforms.mousePosition = [e.clientX - rect.left, e.clientY - rect.top];
            this.uniforms.mouseDelta = [e.movementX, -e.movementY];

            if (this.programInfo !== null)
            {
                this.programInfo.OnMouseMove(e, this.uniforms, this.camera);
            }
        });

        window.addEventListener('mousedown', (e: MouseEvent) =>
        {
            const rect = this.canvas!.getBoundingClientRect();

            this.uniforms.mouseDown = true;
            this.uniforms.mouseClickPosition = [e.clientX - rect.left, e.clientY - rect.top];
            this.uniforms.mouseClickTime = this.uniforms.time;
            this.uniforms.mouseDelta = [0.0, 0.0];

            if (this.programInfo !== null)
            {
                this.programInfo.OnMouseDown(e, this.uniforms);
            }
        });
        
        window.addEventListener('mouseup', (e: MouseEvent) =>
        {
            this.uniforms.mouseDown = false;

            if (this.programInfo !== null)
            {
                this.programInfo.OnMouseUp(e, this.uniforms);
            }
        });

        window.addEventListener('touchmove', (e: TouchEvent) =>
        {
            const rect = this.canvas!.getBoundingClientRect();

            this.uniforms.mousePosition = [e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top];
        });

        window.addEventListener('touchstart', (e: TouchEvent) => 
        {
            const rect = this.canvas!.getBoundingClientRect();

            this.uniforms.mouseClickPosition = [e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top];
            this.uniforms.mouseClickTime = this.uniforms.time;
        });
    }

    public Update(timeSinceLoad: number): void
    {
        if (timeSinceLoad - this.uniforms.time < this.TARGET_MS)
        {
            return;
        }
        
        // this.camera.position = [Math.sin(timeSinceLoad * 0.0001) * 12.0, 0.0, Math.cos(timeSinceLoad * 0.0001) * 12.0];
        // this.camera.target = [0.0, Math.sin(timeSinceLoad * 0.001) * 12.0, 0.0];
        this.camera.target = [0.0, 0.0, -15.0];
        this.camera.Update();

        this.uniforms.UpdateTime(timeSinceLoad);
        this.DrawScene();
    }

    private DrawScene(): void
    {
        if (this.programInfo !== null && this.gl !== null)
        {
            this.programInfo.Execute(this.gl, this.uniforms, this.camera);
        }
    }
}

function Render(timeSinceLoad: number): void
{
    gl.Update(timeSinceLoad);
    gl.currentFrame = requestAnimationFrame(Render);
}

function StartRender(): void
{
    Render(0.0);
}

async function LoadShaderProgram(vertexProgramPath: string, fragmentProgramPath: string): Promise<void>
{
    if (gl.gl === null)
    {
        return;
    }

    const shaderProgram = await InitShaderProgram(gl.gl, vertexProgramPath, fragmentProgramPath);

    if (shaderProgram === null)
    {
        return;
    }

    const programInfo = new Shader3ProgramInfo(gl.gl, shaderProgram, gl.uniforms, gl.camera);
    gl.programInfo = programInfo;
}

export function InitWebGL(): void
{
    const webGLCanvas: HTMLCanvasElement | null = document.querySelector<HTMLCanvasElement>('#webGLCanvas');
    //const webGLCanvas: HTMLCanvasElement = document.getElementById('#webGLCanvas') as HTMLCanvasElement;
    
    if (webGLCanvas === null)
    {
        console.log("Canvas Null");
        return;
    }

    gl.Initialize(webGLCanvas);
    StartRender();

    LoadShaderProgram('./public/shaders/shader3/vertexProgram.vert', './public/shaders/shader3/fragmentProgram.frag');
}

const gl: GLCTX = new GLCTX();