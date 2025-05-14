class Uniforms {
    time = 0.0;
    screenSize = {
        x: 0.0,
        y: 0.0
    };
    Update(timeSinceLoad) {
        this.time = timeSinceLoad;
        this.screenSize.x = window.innerWidth;
        this.screenSize.y = window.innerHeight;
    }
}
class GLCTX {
    gl = null;
    programInfo = null;
    uniforms = new Uniforms();
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
        window.addEventListener('resize', () => {
            if (this.gl !== null) {
                this.gl.canvas.width = window.innerWidth;
                this.gl.canvas.height = window.innerHeight;
            }
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
export class ProgramInfo {
    program;
    vertexIDBuffer;
    vertCount = 3;
    aLoc;
    uLoc;
    constructor(gl, program) {
        this.aLoc =
            {
                vertexID: gl.getAttribLocation(program, 'inVertexID')
            };
        this.uLoc =
            {
                time: gl.getUniformLocation(program, 'uTime'),
                screenSize: gl.getUniformLocation(program, 'uScreenSize')
            };
        this.program = program;
        this.vertexIDBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexIDBuffer);
        let vertexIDData = new Array(this.vertCount);
        for (let i = 0; i < this.vertCount; i++) {
            vertexIDData[i] = i;
        }
        gl.bufferData(gl.ARRAY_BUFFER, new Int32Array(vertexIDData), gl.STATIC_DRAW);
    }
    UpdateUniforms(gl, uniforms) {
        gl.uniform1f(this.uLoc.time, uniforms.time);
        gl.uniform2f(this.uLoc.screenSize, uniforms.screenSize.x, uniforms.screenSize.y);
    }
    Execute(gl, uniforms) {
        if (this === null) {
            return;
        }
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.useProgram(this.program);
        this.UpdateUniforms(gl, uniforms);
        gl.enableVertexAttribArray(this.aLoc.vertexID);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexIDBuffer);
        const size = 1;
        const type = gl.INT;
        const stride = 0;
        const offset = 0;
        gl.vertexAttribIPointer(this.aLoc.vertexID, size, type, stride, offset);
        gl.drawArrays(gl.TRIANGLES, 0, this.vertCount);
        gl.disableVertexAttribArray(this.aLoc.vertexID);
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
