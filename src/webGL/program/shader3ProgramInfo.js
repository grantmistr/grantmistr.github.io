import { ProgramInfo } from "./programInfo.js";
export class Shader3ProgramInfo extends ProgramInfo {
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
                screenSize: gl.getUniformLocation(program, 'uScreenSize'),
                mousePosition: gl.getUniformLocation(program, 'uMousePosition'),
                sphereRotationMatrix: gl.getUniformLocation(program, 'uSphereRotationMatrix'),
                fSphereDirections: gl.getUniformLocation(program, 'uFSphereDirections'),
                invProjMatrix: gl.getUniformLocation(program, 'uInvProjMatrix'),
                invViewMatrix: gl.getUniformLocation(program, 'uInvViewMatrix'),
                cameraPosition: gl.getUniformLocation(program, 'uCameraPosition')
            };
    }
    UpdateUniforms(gl, uniforms, camera, rotationMatrix, fSphereDir) {
        gl.uniform1f(this.uLoc.time, uniforms.time);
        gl.uniform2f(this.uLoc.screenSize, uniforms.screenSize[0], uniforms.screenSize[1]);
        gl.uniform2f(this.uLoc.mousePosition, uniforms.mousePosition[0], uniforms.mousePosition[1]);
        gl.uniformMatrix3fv(this.uLoc.sphereRotationMatrix, false, rotationMatrix.flat());
        gl.uniform4fv(this.uLoc.fSphereDirections, fSphereDir.flat());
        gl.uniformMatrix4fv(this.uLoc.invProjMatrix, false, camera.invProjection.flat());
        gl.uniformMatrix3fv(this.uLoc.invViewMatrix, false, camera.invView.flat());
        gl.uniform3f(this.uLoc.cameraPosition, camera.position[0], camera.position[1], camera.position[2]);
    }
    ProgramLogic(gl) {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.drawArrays(gl.TRIANGLES, 0, this.vertCount);
    }
}
