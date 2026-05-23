import * as Vec3 from "./vector3.js";
import * as Vec2 from "./vector2.js";
import * as Mat3 from "./matrix3.js";
export function RotateSphere(mouseDelta, sphere) {
    const a = [mouseDelta[0], mouseDelta[1], 0];
    const b = [0.0, 0.0, 1.0];
    const axis = Vec3.CrossProduct(a, b); // axis of rotation
    const theta = Vec2.LengthSquared(mouseDelta);
    const m = Mat3.RotationMatrixFromAxisAndAngle(axis, theta);
    sphere.rotation = Vec3.MultiplyByMat3(m, sphere.rotation);
}
export function CalculateSphereRotationMatrix(mouseDelta) {
    const a = [mouseDelta[0], mouseDelta[1], 0];
    const b = [0.0, 0.0, 1.0];
    const axis = Vec3.Normalize(Vec3.CrossProduct(a, b)); // axis of rotation
    const theta = Vec2.Length(mouseDelta) * 0.002;
    return Mat3.RotationMatrixFromAxisAndAngle(axis, theta);
}
