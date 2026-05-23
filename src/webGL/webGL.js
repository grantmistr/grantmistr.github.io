import { Camera } from "./camera.js";
import { Shader3ProgramInfo } from "./program/shader3ProgramInfo.js";
import { InitShaderProgram } from "./shaderLoader.js";
import { SceneConstants } from "./constants.js";
export class Uniforms {
    time = 0.0;
    deltaTime = 0.0;
    mouseClickTime = 0.0;
    mouseDown = false;
    screenSize = [0, 0];
    aspectRatio = 1.0;
    mousePosition = [0, 0];
    mouseClickPosition = [0, 0];
    mouseDelta = [0, 0];
    UpdateTime(timeSinceLoad) {
        this.deltaTime = timeSinceLoad - this.time;
        this.time = timeSinceLoad;
    }
}
class GLCTX {
    TARGET_FPS = 100.0;
    TARGET_MS = 1000.0 / this.TARGET_FPS;
    gl = null;
    canvas = null;
    programInfo = null;
    programInfos = new Array(0);
    uniforms = new Uniforms();
    currentFrame = 0;
    prevFrameTime = 0.0;
    camera = new Camera(SceneConstants.CAMERA_NEAR, SceneConstants.CAMERA_FAR, SceneConstants.CAMERA_FOV, window.innerWidth / window.innerHeight, [0.0, 0.0, -SceneConstants.CAMERA_DISTANCE], [0.0, 0.0, 0.0]);
    Initialize(canvas) {
        this.gl = canvas.getContext("webgl2");
        this.canvas = canvas;
        if (this.gl === null || this.canvas === null) {
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
        window.addEventListener('resize', (e) => {
            this.gl.canvas.width = window.innerWidth;
            this.gl.canvas.height = window.innerHeight;
            this.uniforms.screenSize = [window.innerWidth, window.innerHeight];
            this.uniforms.aspectRatio = window.innerWidth / window.innerHeight;
            this.camera.UpdateProjectionMatrix(this.uniforms.aspectRatio);
            if (this.programInfo !== null) {
                this.programInfo.OnResize(e, this.uniforms, this.camera);
            }
        });
        window.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.uniforms.mousePosition = [e.clientX - rect.left, e.clientY - rect.top];
            this.uniforms.mouseDelta = [e.movementX, -e.movementY];
            if (this.programInfo !== null) {
                this.programInfo.OnMouseMove(e, this.uniforms, this.camera);
            }
        });
        window.addEventListener('mousedown', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.uniforms.mouseDown = true;
            this.uniforms.mouseClickPosition = [e.clientX - rect.left, e.clientY - rect.top];
            this.uniforms.mouseClickTime = this.uniforms.time;
            this.uniforms.mouseDelta = [0.0, 0.0];
            if (this.programInfo !== null) {
                this.programInfo.OnMouseDown(e, this.uniforms);
            }
        });
        window.addEventListener('mouseup', (e) => {
            this.uniforms.mouseDown = false;
            if (this.programInfo !== null) {
                this.programInfo.OnMouseUp(e, this.uniforms);
            }
        });
        window.addEventListener('touchmove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.uniforms.mousePosition = [e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top];
        });
        window.addEventListener('touchstart', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.uniforms.mouseClickPosition = [e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top];
            this.uniforms.mouseClickTime = this.uniforms.time;
        });
    }
    Update(timeSinceLoad) {
        if (timeSinceLoad - this.uniforms.time < this.TARGET_MS) {
            return;
        }
        // this.camera.position = [Math.sin(timeSinceLoad * 0.0001) * 12.0, 0.0, Math.cos(timeSinceLoad * 0.0001) * 12.0];
        // this.camera.target = [0.0, Math.sin(timeSinceLoad * 0.001) * 12.0, 0.0];
        this.camera.target = [0.0, 0.0, -15.0];
        this.camera.Update();
        this.uniforms.UpdateTime(timeSinceLoad);
        this.DrawScene();
    }
    DrawScene() {
        if (this.programInfo !== null && this.gl !== null) {
            this.programInfo.Execute(this.gl, this.uniforms, this.camera);
        }
    }
}
function Render(timeSinceLoad) {
    gl.Update(timeSinceLoad);
    gl.currentFrame = requestAnimationFrame(Render);
}
function StartRender() {
    Render(0.0);
}
async function LoadShaderProgram(vertexProgramPath, fragmentProgramPath) {
    if (gl.gl === null) {
        return;
    }
    const shaderProgram = await InitShaderProgram(gl.gl, vertexProgramPath, fragmentProgramPath);
    if (shaderProgram === null) {
        return;
    }
    const programInfo = new Shader3ProgramInfo(gl.gl, shaderProgram, gl.uniforms, gl.camera);
    gl.programInfo = programInfo;
}
export function InitWebGL() {
    const webGLCanvas = document.querySelector('#webGLCanvas');
    //const webGLCanvas: HTMLCanvasElement = document.getElementById('#webGLCanvas') as HTMLCanvasElement;
    if (webGLCanvas === null) {
        console.log("Canvas Null");
        return;
    }
    gl.Initialize(webGLCanvas);
    StartRender();
    LoadShaderProgram('./public/shaders/shader3/vertexProgram.vert', './public/shaders/shader3/fragmentProgram.frag');
}
const gl = new GLCTX();
