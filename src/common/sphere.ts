import * as Vec3 from "./vector3.js";
import * as Vec2 from "./vector2.js";
import * as Mat3 from "./matrix3.js";

type SphereOrbitData =
{

};

export type Sphere =
{
    radius: number;
    position: Vec3.Vec3;
    rotation: Vec3.Vec3;
};

export function RotateSphere(mouseDelta: Vec2.Vec2, sphere: Sphere): void
{
    const a: Vec3.Vec3 = [mouseDelta[0], mouseDelta[1], 0];
    const b: Vec3.Vec3 = [0.0, 0.0, 1.0];

    const axis = Vec3.CrossProduct(a, b); // axis of rotation
    const theta = Vec2.LengthSquared(mouseDelta);

    const m = Mat3.RotationMatrixFromAxisAndAngle(axis, theta);
    sphere.rotation = Vec3.MultiplyByMat3(m, sphere.rotation);
}

export function CalculateSphereRotationMatrix(mouseDelta: Vec2.Vec2): Mat3.Mat3
{
    const a: Vec3.Vec3 = [mouseDelta[0], mouseDelta[1], 0];
    const b: Vec3.Vec3 = [0.0, 0.0, 1.0];

    const axis = Vec3.Normalize(Vec3.CrossProduct(a, b)); // axis of rotation
    const theta = Vec2.Length(mouseDelta) * 0.002;

    return Mat3.RotationMatrixFromAxisAndAngle(axis, theta);
}