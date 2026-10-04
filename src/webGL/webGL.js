export class GLCTX {
    gl = null;
    canvas = null;
    Initialize() {
        this.canvas = document.querySelector('#webGLCanvas');
        if (this.canvas === null) {
            console.log("Canvas Null");
            return;
        }
        this.gl = this.canvas.getContext("webgl2");
        if (this.gl === null) {
            console.log("WebGL2RenderingContext Null");
            return;
        }
        this.gl.canvas.width = window.innerWidth;
        this.gl.canvas.height = window.innerHeight;
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }
    OnResize() {
        this.gl.canvas.width = window.innerWidth;
        this.gl.canvas.height = window.innerHeight;
    }
    Draw(programInfo) {
        if (this.gl !== null && programInfo !== null) {
            programInfo.Execute(this.gl);
        }
    }
    SetActiveProgram(programInfo) {
        if (this.gl !== null && programInfo !== null) {
            this.gl.useProgram(programInfo.program);
        }
    }
}
