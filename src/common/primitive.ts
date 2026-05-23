import * as Vec3 from "./vector3.js";

export function ClosestPointOnLineFromPoint(linePoint: Vec3.Vec3, lineDirection: Vec3.Vec3, point: Vec3.Vec3): Vec3.Vec3
{
    const d = Vec3.Dot(lineDirection, Vec3.Subtract(point, linePoint));
    return Vec3.Add(linePoint, Vec3.MultiplyScalar(lineDirection, d));
}