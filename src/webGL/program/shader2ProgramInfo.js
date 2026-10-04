import { ProgramInfo } from "./programInfo.js";
export class Shader2ProgramInfo extends ProgramInfo {
    vertCount = 3;
    aLoc;
    uLoc;
    constructor(gl, program) {
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
    UpdateUniforms(gl, uniforms) {
        gl.uniform1f(this.uLoc.time, uniforms.time);
        gl.uniform1f(this.uLoc.mouseClickTime, uniforms.mouseClickTime);
        gl.uniform2f(this.uLoc.screenSize, uniforms.screenSize[0], uniforms.screenSize[1]);
        gl.uniform2f(this.uLoc.mousePosition, uniforms.mousePosition[0], uniforms.mousePosition[1]);
        gl.uniform2f(this.uLoc.mouseClickPosition, uniforms.mouseClickPosition[0], uniforms.mouseClickPosition[1]);
    }
    ProgramLogic(gl) {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.drawArrays(gl.TRIANGLES, 0, this.vertCount);
    }
}
