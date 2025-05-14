class Uniforms
{
    public time: number = 0.0;
    public screenSize = 
    {
        x: 0.0,
        y: 0.0
    };

    public Update(timeSinceLoad: number): void
    {
        this.time = timeSinceLoad;
        this.screenSize.x = window.innerWidth;
        this.screenSize.y = window.innerHeight;
    }
}

class GLCTX
{
    public gl: WebGL2RenderingContext | null = null;
    public programInfo: ProgramInfo | null = null;
    public uniforms: Uniforms = new Uniforms();

    public Initialize(canvas: HTMLCanvasElement): void
    {
        this.gl = canvas.getContext("webgl2");

        if (this.gl === null)
        {
            console.log("WebGL2RenderingContext Null");
            return;
        }

        this.gl.canvas.width = window.innerWidth;
        this.gl.canvas.height = window.innerHeight;

        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        window.addEventListener('resize', () => 
        {
            if (this.gl !== null)
            {
                this.gl.canvas.width = window.innerWidth;
                this.gl.canvas.height = window.innerHeight;
            }
        });
    }

    public Update(timeSinceLoad: number): void
    {
        this.uniforms.Update(timeSinceLoad);
        this.DrawScene();
    }

    private DrawScene(): void
    {
        if (this.programInfo !== null && this.gl !== null)
        {
            this.programInfo.Execute(this.gl, this.uniforms);
        }
    }
}

export class ProgramInfo
{
    public program: WebGLProgram;
    public vertexIDBuffer: WebGLBuffer;
    public vertCount: GLuint = 3;

    public aLoc:
    {
        vertexID: GLint
    };

    public uLoc:
    {
        time: WebGLUniformLocation | null,
        screenSize: WebGLUniformLocation | null
    };

    public constructor(gl: WebGL2RenderingContext, program: WebGLProgram)
    {
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

        let vertexIDData: Array<GLint> = new Array<GLint>(this.vertCount);
        for (let i: GLint = 0; i < this.vertCount; i++)
        {
            vertexIDData[i] = i;
        }

        gl.bufferData(gl.ARRAY_BUFFER, new Int32Array(vertexIDData), gl.STATIC_DRAW);
    }

    private UpdateUniforms(gl: WebGL2RenderingContext, uniforms: Uniforms): void
    {
        gl.uniform1f(this.uLoc.time, uniforms.time);
        gl.uniform2f(this.uLoc.screenSize, uniforms.screenSize.x, uniforms.screenSize.y);
    }

    public Execute(gl: WebGL2RenderingContext, uniforms: Uniforms): void
    {
        if (this === null)
        {
            return;
        }

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.useProgram(this.program);

        this.UpdateUniforms(gl, uniforms);

        gl.enableVertexAttribArray(this.aLoc.vertexID);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexIDBuffer);
        
        const size: GLint = 1;
        const type: GLenum = gl.INT;
        const stride: GLsizei = 0;
        const offset: GLintptr = 0;
        gl.vertexAttribIPointer(this.aLoc.vertexID, size, type, stride, offset);
        
        gl.drawArrays(gl.TRIANGLES, 0, this.vertCount);

        gl.disableVertexAttribArray(this.aLoc.vertexID);
    }
}

function Render(timeSinceLoad: number): void
{
    gl.Update(timeSinceLoad);
    requestAnimationFrame(Render);
}

export function StartRender(): void
{
    Render(0.0);
}

export const gl: GLCTX = new GLCTX();