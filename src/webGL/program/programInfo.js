export class ProgramInfo {
    program;
    constructor(gl, program) {
        this.program = program;
    }
    Execute = (gl) => {
        this.ProgramLogic(gl);
    };
}
