import { InitShaderProgram } from "../../shader/shaderLoader.js";
import { gl, ProgramInfo, StartRender } from "./webGL.js";
function Init() {
    UpdateHeaderButtonLogoViewBox();
    InitWebGL();
}
function UpdateHeaderButtonLogoViewBox() {
    const headerButtonLogos = document.querySelectorAll('.headerButtonLogo');
    headerButtonLogos.forEach((headerButtonLogo) => {
        let path = headerButtonLogo.querySelector('path');
        if (path != null) {
            let rect = path.getBBox();
            headerButtonLogo.setAttribute('viewBox', rect.x + ' ' + rect.y + ' ' + rect.width + ' ' + rect.height);
        }
    });
}
function InitWebGL() {
    const webGLCanvas = document.querySelector('#webGLCanvas');
    //const webGLCanvas: HTMLCanvasElement = document.getElementById('#webGLCanvas') as HTMLCanvasElement;
    if (webGLCanvas === null) {
        console.log("Canvas Null");
        return;
    }
    gl.Initialize(webGLCanvas);
    StartRender();
    LoadShaderProgram();
}
async function LoadShaderProgram() {
    if (gl.gl === null) {
        return;
    }
    const shaderProgram = await InitShaderProgram(gl.gl, './public/shaders/shader0/vertexProgram.vert', './public/shaders/shader0/fragmentProgram.frag');
    if (shaderProgram === null) {
        return;
    }
    const programInfo = new ProgramInfo(gl.gl, shaderProgram);
    gl.programInfo = programInfo;
}
Init();
