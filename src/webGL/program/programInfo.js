export class ProgramInfo {
    program;
    constructor(program) {
        this.program = program;
    }
    OnResize(e, uniforms, camera) { }
    OnMouseMove(e, uniforms, camera) { }
    OnMouseDown(e, uniforms) { }
    OnMouseUp(e, uniforms) { }
    Execute = (gl, uniforms, camera) => {
        gl.useProgram(this.program);
        this.UpdateUniforms(gl, uniforms, camera);
        this.ProgramLogic(gl);
    };
}
