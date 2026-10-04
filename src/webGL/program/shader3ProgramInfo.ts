import { ProgramInfo } from "./programInfo.js";
import { Uniforms } from "../../pageManager/pageManager.js";
import * as Mat3 from "../../common/matrix3.js";
import { Camera } from "../camera.js";

export class Shader3ProgramInfo extends ProgramInfo
{
    private vertCount: GLuint = 3;

    private aLoc:
    {
        vertexID: GLint
    };

    private uLoc:
    {
        time: WebGLUniformLocation | null,
        screenSize: WebGLUniformLocation | null,
        mousePosition: WebGLUniformLocation | null,
        sphereRotationMatrix: WebGLUniformLocation | null,
        fSphereDirections: WebGLUniformLocation | null,
        invProjMatrix: WebGLUniformLocation | null,
        invViewMatrix: WebGLUniformLocation | null,
        cameraPosition: WebGLUniformLocation | null
    };

    public constructor(gl: WebGL2RenderingContext, program: WebGLProgram)
    {
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

    public UpdateUniforms(gl: WebGL2RenderingContext, uniforms: Uniforms, camera: Camera, rotationMatrix: Mat3.Mat3, fSphereDir: Array<[number, number, number, number]>): void
    {
        gl.uniform1f(this.uLoc.time, uniforms.time);
        gl.uniform2f(this.uLoc.screenSize, uniforms.screenSize[0], uniforms.screenSize[1]);
        gl.uniform2f(this.uLoc.mousePosition, uniforms.mousePosition[0], uniforms.mousePosition[1]);
        gl.uniformMatrix3fv(this.uLoc.sphereRotationMatrix, false, rotationMatrix.flat());
        gl.uniform4fv(this.uLoc.fSphereDirections, fSphereDir.flat());
        gl.uniformMatrix4fv(this.uLoc.invProjMatrix, false, camera.invProjection.flat());
        gl.uniformMatrix3fv(this.uLoc.invViewMatrix, false, camera.invView.flat());
        gl.uniform3f(this.uLoc.cameraPosition, camera.position[0], camera.position[1], camera.position[2]);
    }

    protected ProgramLogic(gl: WebGL2RenderingContext): void
    {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.drawArrays(gl.TRIANGLES, 0, this.vertCount);
    }
}