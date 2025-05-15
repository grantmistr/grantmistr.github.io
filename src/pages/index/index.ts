import * as ProgramInfo from "../../shader/programInfo.js";
import { InitShaderProgram } from "../../shader/shaderLoader.js";
import { gl, StartRender } from "../../shader/webGL.js";

function Init(): void
{
    UpdateHeaderButtonLogoViewBox();
    InitWebGL();
}

function UpdateHeaderButtonLogoViewBox(): void
{
    const headerButtonLogos: NodeListOf<SVGElement> = document.querySelectorAll<SVGElement>('.headerButtonLogo');

    headerButtonLogos.forEach((headerButtonLogo) =>
    {
        let path: SVGPathElement | null = headerButtonLogo.querySelector<SVGPathElement>('path');

        if (path != null)
        {
            let rect: DOMRect = path.getBBox();
            headerButtonLogo.setAttribute('viewBox', rect.x + ' ' + rect.y + ' ' + rect.width + ' ' + rect.height);
        }
    });
}

function InitWebGL(): void
{
    const webGLCanvas: HTMLCanvasElement | null = document.querySelector<HTMLCanvasElement>('#webGLCanvas');
    //const webGLCanvas: HTMLCanvasElement = document.getElementById('#webGLCanvas') as HTMLCanvasElement;
    
    if (webGLCanvas === null)
    {
        console.log("Canvas Null");
        return;
    }

    gl.Initialize(webGLCanvas);
    StartRender();

    LoadShaderProgram();
}

async function LoadShaderProgram(): Promise<void>
{
    if (gl.gl === null)
    {
        return;
    }

    const shaderProgram = await InitShaderProgram(gl.gl, './public/shaders/shader1/vertexProgram.vert', './public/shaders/shader1/fragmentProgram.frag');

    if (shaderProgram === null)
    {
        return;
    }

    const programInfo = new ProgramInfo.Shader1ProgramInfo(gl.gl, shaderProgram);
    gl.programInfo = programInfo;
}

Init();