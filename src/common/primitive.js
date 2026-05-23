import * as Vec3 from "./vector3.js";
export function ClosestPointOnLineFromPoint(linePoint, lineDirection, point) {
    const d = Vec3.Dot(lineDirection, Vec3.Subtract(point, linePoint));
    return Vec3.Add(linePoint, Vec3.MultiplyScalar(lineDirection, d));
}
