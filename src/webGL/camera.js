import * as Vec3 from "../common/vector3.js";
import * as Mat3 from "../common/matrix3.js";
import * as Mat4 from "../common/matrix4.js";
import { SceneConstants } from "./constants.js";
export class Camera {
    near = 0.2;
    far = 100.0;
    FOV = 1.0;
    position = [0.0, 0.0, 0.0];
    target = [0.0, 0.0, 0.0];
    view = Mat3.IDENTITY;
    invView = Mat3.IDENTITY;
    projection = Mat4.IDENTITY;
    invProjection = Mat4.IDENTITY;
    right = () => { return this.view[0]; };
    up = () => { return this.view[1]; };
    forward = () => { return this.view[2]; };
    constructor(near, far, FOV, aspect, position, target) {
        this.near = near;
        this.far = far;
        this.FOV = FOV;
        this.position = position;
        this.target = target;
        this.CalculateProjectionMatrix(aspect);
        this.Update();
    }
    CalculateProjectionMatrix(aspect) {
        const f = 1.0 / Math.tan(this.FOV * 0.5);
        const nMinusF = this.near - this.far;
        const nPlusF = this.near + this.far;
        const twoNF = 2.0 * this.near * this.far;
        this.projection = [
            [f / aspect, 0.0, 0.0, 0.0],
            [0.0, f, 0.0, 0.0],
            [0.0, 0.0, nPlusF / nMinusF, twoNF / nMinusF],
            [0.0, 0.0, -1.0, 0.0]
        ];
        this.invProjection = [
            [aspect / f, 0.0, 0.0, 0.0],
            [0.0, 1.0 / f, 0.0, 0.0],
            [0.0, 0.0, 0.0, -1.0],
            [0.0, 0.0, nMinusF / twoNF, nPlusF / twoNF]
        ];
    }
    TransformByProjectionMatrix(v) {
        const x = this.projection[0][0] * v[0];
        const y = this.projection[1][1] * v[1];
        const z = this.projection[2][2] * v[2] + this.projection[2][3] * v[3];
        const w = this.projection[3][2] * v[2];
        return [x, y, z, w];
    }
    TransformByInverseProjectionMatrix(v) {
        const x = this.invProjection[0][0] * v[0];
        const y = this.invProjection[1][1] * v[1];
        const z = this.invProjection[2][3] * v[3];
        const w = this.invProjection[3][2] * v[2] + this.invProjection[3][3] * v[3];
        return [x, y, z, w];
    }
    Update() {
        const f = Vec3.Normalize(Vec3.Subtract(this.target, this.position));
        const r = Vec3.Normalize(Vec3.CrossProduct(f, SceneConstants.UP));
        const u = Vec3.Normalize(Vec3.CrossProduct(r, f));
        //this.view = [r, u, f];
        //this.view = Mat3.Transpose(this.view);
        this.view = [r, u, [-f[0], -f[1], -f[2]]];
        this.invView = Mat3.Transpose(this.view);
    }
    UpdateProjectionMatrix(aspect) {
        this.CalculateProjectionMatrix(aspect);
    }
    CalculatePositionOnNearClipPlane(positionNDC) {
        const t = this.TransformByInverseProjectionMatrix([positionNDC[0], positionNDC[1], -1.0, 1.0]);
        let v = [t[0] / t[3], t[1] / t[3], t[2] / t[3]];
        v = Vec3.MultiplyByMat3(this.invView, v);
        v = Vec3.Add(v, this.position);
        return v;
        //return Vec3.Add3(Vec3.MultiplyScalar(this.forward, this.near), Vec3.MultiplyScalar(this.right, positionNDCAspect[0] * this.FOV), Vec3.MultiplyScalar(this.up, positionNDCAspect[1] * this.FOV));
    }
    TransformToViewSpace(positionNDC) {
        const t = this.TransformByInverseProjectionMatrix([positionNDC[0], positionNDC[1], -1.0, 1.0]);
        let v = [t[0] / t[3], t[1] / t[3], t[2] / t[3]];
        v = Vec3.MultiplyByMat3(this.invView, v);
        return v;
    }
}
