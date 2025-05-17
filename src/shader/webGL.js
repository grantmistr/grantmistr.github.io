export class Uniforms {
    time = 0.0;
    deltaTime = 0.0;
    mouseClickTime = 0.0;
    screenSize = {
        x: 0.0,
        y: 0.0
    };
    mousePosition = {
        x: 0.0,
        y: 0.0
    };
    mouseClickPosition = {
        x: 0.0,
        y: 0.0
    };
    Update(timeSinceLoad) {
        this.deltaTime = timeSinceLoad - this.time;
        this.time = timeSinceLoad;
    }
}
class GLCTX {
    gl = null;
    programInfo = null;
    uniforms = new Uniforms();
    mouseClickLock = false;
    Initialize(canvas) {
        this.gl = canvas.getContext("webgl2");
        if (this.gl === null) {
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
        window.addEventListener('resize', () => {
            if (this.gl !== null) {
                this.gl.canvas.width = window.innerWidth;
                this.gl.canvas.height = window.innerHeight;
            }
            this.uniforms.screenSize.x = window.innerWidth;
            this.uniforms.screenSize.y = window.innerHeight;
        });
        window.addEventListener('mousemove', (e) => {
            this.uniforms.mousePosition.x = e.clientX;
            this.uniforms.mousePosition.y = e.clientY;
        });
        window.addEventListener('mousedown', (e) => {
            // if (!this.mouseClickLock)
            // {
            //     this.mouseClickLock = true;
            //     this.uniforms.mouseClickPosition.x = e.clientX;
            //     this.uniforms.mouseClickPosition.y = e.clientY;
            //     this.uniforms.mouseClickTime = this.uniforms.time;
            // }
            // else
            // {
            //     if ((this.uniforms.time - this.uniforms.mouseClickTime) > 1000.0)
            //     {
            //         this.mouseClickLock = false;
            //     }
            // }
            this.uniforms.mouseClickPosition.x = e.clientX;
            this.uniforms.mouseClickPosition.y = e.clientY;
            this.uniforms.mouseClickTime = this.uniforms.time;
        });
    }
    Update(timeSinceLoad) {
        this.uniforms.Update(timeSinceLoad);
        this.DrawScene();
    }
    DrawScene() {
        if (this.programInfo !== null && this.gl !== null) {
            this.programInfo.Execute(this.gl, this.uniforms);
        }
    }
}
function Render(timeSinceLoad) {
    gl.Update(timeSinceLoad);
    requestAnimationFrame(Render);
}
export function StartRender() {
    Render(0.0);
}
export const gl = new GLCTX();
