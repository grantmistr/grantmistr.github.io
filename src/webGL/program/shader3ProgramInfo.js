import { ProgramInfo } from "./programInfo.js";
import * as Vec3 from "../../common/vector3.js";
import * as Vec2 from "../../common/vector2.js";
import * as Mat3 from "../../common/matrix3.js";
import { F_SPHERE_COLORS, F_SPHERE_COUNT, F_SPHERE_DIRECTIONS } from "../../common/fibonacciSphere.js";
import { ClosestPointOnLineFromPoint } from "../../common/primitive.js";
export class Shader3ProgramInfo extends ProgramInfo {
    vertexIDBuffer;
    vertCount = 3;
    aLoc;
    uLoc;
    constants = {
        MAIN_SPHERE_POSITION: [0.0, 0.0, 0.0],
        MAIN_SPHERE_RADIUS: 4.0,
        SPHERE_ROTATION_DEFAULT_DELTA: [0.0005, 0.0003]
    };
    mouseDelta = [0.0, 0.0];
    sphereRotationDelta = [0.0, 0.0];
    rotationMatrix = Mat3.IDENTITY;
    fSphereDir = Array(F_SPHERE_COUNT);
    fSphereElements = Array(F_SPHERE_COUNT);
    mouseInfluenceWeightsDidUpdate = false;
    cssPerspective = 1.0;
    constructor(gl, program, uniforms, camera) {
        super(program);
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
        this.vertexIDBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexIDBuffer);
        let vertexIDData = new Array(this.vertCount);
        for (let i = 0; i < this.vertCount; i++) {
            vertexIDData[i] = i;
        }
        gl.bufferData(gl.ARRAY_BUFFER, new Int32Array(vertexIDData), gl.STATIC_DRAW);
        this.InitFSphereDirArray();
        this.InitHTMLElements(uniforms, camera);
    }
    InitFSphereDirArray() {
        for (let i = 0; i < F_SPHERE_COUNT; i++) {
            const d = F_SPHERE_DIRECTIONS[i];
            this.fSphereDir[i] = [d[0], d[1], d[2], 0.0];
        }
    }
    UpdateSphereRotationDelta(uniforms) {
        if (uniforms.mouseDown) {
            this.sphereRotationDelta = Vec2.MultiplyScalar(this.mouseDelta, 0.5);
        }
        else {
            const factor = Math.max(1.0 - Math.max(uniforms.deltaTime * 0.002, Number.EPSILON), 0.0);
            this.sphereRotationDelta = Vec2.MultiplyScalar(this.sphereRotationDelta, factor);
            this.sphereRotationDelta = Vec2.Add(this.sphereRotationDelta, Vec2.MultiplyScalar(this.constants.SPHERE_ROTATION_DEFAULT_DELTA, Math.min(uniforms.deltaTime, 33.333))); // clamp dT to ~30 fps
        }
    }
    CalculateSphereRotationMatrix(delta) {
        const mLenSqr = Vec2.LengthSquared(delta);
        if (mLenSqr <= 0.0) {
            return Mat3.IDENTITY;
        }
        const a = [delta[0], delta[1], 0.0];
        const b = [0.0, 0.0, 1.0];
        const axis = Vec3.Normalize(Vec3.CrossProduct(a, b)); // axis of rotation
        const theta = Math.sqrt(mLenSqr) * 0.004;
        return Mat3.RotationMatrixFromAxisAndAngle(axis, theta);
    }
    CalculateMouseInfluenceWeights(uniforms, camera) {
        // this function updates if the sphere is rotating, or if the mouse moved, so prevent doing the logic twice
        if (this.mouseInfluenceWeightsDidUpdate) {
            return;
        }
        this.mouseInfluenceWeightsDidUpdate = true;
        const mousePos01 = [uniforms.mousePosition[0] / uniforms.screenSize[0], uniforms.mousePosition[1] / uniforms.screenSize[1]];
        const mousePosNDC = [mousePos01[0] * 2.0 - 1.0, mousePos01[1] * -2.0 + 1.0];
        //const mousePosNDCAspect: Vec2.Vec2 = [mousePosNDC[0] * uniforms.aspectRatio, mousePosNDC[1]];
        const nearClipPos = camera.TransformToViewSpace(mousePosNDC);
        const mouseV = Vec3.Normalize(nearClipPos);
        const mouseP = Vec3.Add(nearClipPos, camera.position);
        for (let i = 0; i < F_SPHERE_COUNT; i++) {
            const d = [this.fSphereDir[i][0], this.fSphereDir[i][1], this.fSphereDir[i][2]];
            const p = Vec3.Add(Vec3.MultiplyScalar(d, this.constants.MAIN_SPHERE_RADIUS), this.constants.MAIN_SPHERE_POSITION);
            let weight = Vec3.LengthSquared(Vec3.Subtract(ClosestPointOnLineFromPoint(mouseP, mouseV, p), p));
            weight = 1.0 / (weight + 1.0);
            const t = 1.0 - Math.max(-Vec3.Dot(d, camera.view[2]), 0.0);
            weight *= 1.0 - t * t;
            this.fSphereDir[i][3] = weight;
        }
    }
    InitHTMLElements(uniforms, camera) {
        this.CalculateCSSPerspective(uniforms, camera);
        const container = document.createElement('div');
        container.id = "fSphereElementsContainer";
        //container.style.perspective = `${this.cssPerspective}px`;
        document.body.appendChild(container);
        const radius = this.constants.MAIN_SPHERE_RADIUS;
        for (let i = 0; i < F_SPHERE_COUNT; i++) {
            const color = Vec3.MultiplyScalar(F_SPHERE_COLORS[i], 2.0);
            const d = F_SPHERE_DIRECTIONS[i];
            const pos = Vec3.Subtract([d[0] * radius, -d[1] * radius, -d[2] * radius], camera.position);
            const v = camera.TransformByProjectionMatrix([pos[0], pos[1], pos[2], 1.0]);
            const p = [(v[0] / v[3]) * window.innerWidth * 0.5, (v[1] / v[3]) * window.innerHeight * 0.5, (v[2] / v[3])];
            const element = document.createElement('div');
            element.className = 'fSphereElement';
            element.textContent = i.toString();
            element.style.background = `rgb(${color[0] * 255.0}, ${color[1] * 255.0}, ${color[2] * 255.0})`;
            element.style.transform = `translate(${p[0]}px, ${p[1]}px)`;
            element.style.zIndex = `${p[2]}`;
            container.appendChild(element);
            this.fSphereElements[i] = element;
        }
    }
    UpdateHTMLElements(camera) {
        const radius = this.constants.MAIN_SPHERE_RADIUS;
        for (let i = 0; i < F_SPHERE_COUNT; i++) {
            const d = this.fSphereDir[i];
            const pos = Vec3.Add([d[0] * radius, -d[1] * radius, -d[2] * radius], camera.position);
            const v = camera.TransformByProjectionMatrix([pos[0], pos[1], pos[2], 1.0]);
            const p = [(v[0] / v[3]) * window.innerWidth * 0.5, (v[1] / v[3]) * window.innerHeight * 0.5, v[2]];
            //this.fSphereElements[i].style.transform = `translate3D(${x}px, ${y}px, ${z}px)`;
            this.fSphereElements[i].style.transform = `translate(${p[0]}px, ${p[1]}px)`;
            this.fSphereElements[i].style.zIndex = `${p[2]}`;
            if (i === 0) {
                //console.log(p[2]);
            }
        }
    }
    CalculateCSSPerspective(uniforms, camera) {
        this.cssPerspective = 0.5 * uniforms.screenSize[1] / Math.tan(camera.FOV);
    }
    UpdateUniforms(gl, uniforms, camera) {
        this.UpdateSphereRotationDelta(uniforms);
        if (this.sphereRotationDelta[0] !== 0.0 || this.sphereRotationDelta[1] !== 0.0) {
            const m = this.CalculateSphereRotationMatrix(this.sphereRotationDelta);
            this.rotationMatrix = Mat3.MultiplyByMat3(m, this.rotationMatrix);
            for (let i = 0; i < F_SPHERE_COUNT; i++) {
                const dir = Vec3.MultiplyByMat3(this.rotationMatrix, F_SPHERE_DIRECTIONS[i]);
                this.fSphereDir[i] = [dir[0], dir[1], dir[2], this.fSphereDir[i][3]];
            }
            this.CalculateMouseInfluenceWeights(uniforms, camera);
            this.UpdateHTMLElements(camera);
        }
        this.mouseDelta = [0.0, 0.0]; // reset to 0 every frame for when mouse stops moving
        this.mouseInfluenceWeightsDidUpdate = false;
        gl.uniform1f(this.uLoc.time, uniforms.time);
        gl.uniform2f(this.uLoc.screenSize, uniforms.screenSize[0], uniforms.screenSize[1]);
        gl.uniform2f(this.uLoc.mousePosition, uniforms.mousePosition[0], uniforms.mousePosition[1]);
        gl.uniformMatrix3fv(this.uLoc.sphereRotationMatrix, false, this.rotationMatrix.flat());
        gl.uniform4fv(this.uLoc.fSphereDirections, this.fSphereDir.flat());
        gl.uniformMatrix4fv(this.uLoc.invProjMatrix, false, camera.invProjection.flat());
        gl.uniformMatrix3fv(this.uLoc.invViewMatrix, false, camera.invView.flat());
        gl.uniform3f(this.uLoc.cameraPosition, camera.position[0], camera.position[1], camera.position[2]);
    }
    ProgramLogic(gl) {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
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
    OnResize(e, uniforms, camera) {
        this.CalculateCSSPerspective(uniforms, camera);
    }
    OnMouseMove(e, uniforms, camera) {
        this.mouseDelta = uniforms.mouseDelta;
        this.CalculateMouseInfluenceWeights(uniforms, camera);
    }
}
