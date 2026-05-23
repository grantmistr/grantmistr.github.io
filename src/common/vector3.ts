import { Mat3 } from "./matrix3.js";

export type Vec3 = [number, number, number];

export function Add(a: Vec3, b: Vec3): Vec3
{
    const o: Vec3 = [
        a[0] + b[0],
        a[1] + b[1],
        a[2] + b[2]
    ];

    return o;
}

export function Add3(a: Vec3, b: Vec3, c: Vec3): Vec3
{
    const o: Vec3 = [
        a[0] + b[0] + c[0],
        a[1] + b[1] + c[1],
        a[2] + b[2] + c[2]
    ];

    return o;
}

export function Subtract(a: Vec3, b: Vec3): Vec3
{
    const o: Vec3 = [
        a[0] - b[0],
        a[1] - b[1],
        a[2] - b[2]
    ];

    return o;
}

export function Multiply(a: Vec3, b: Vec3): Vec3
{
    const o: Vec3 = [
        a[0] * b[0],
        a[1] * b[1],
        a[2] * b[2]
    ];

    return o;
}

export function MultiplyScalar(a: Vec3, b: number): Vec3
{
    const o: Vec3 = [
        a[0] * b,
        a[1] * b,
        a[2] * b
    ];

    return o;
}

export function Dot(a: Vec3, b: Vec3): number
{
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

export function CrossProduct(a: Vec3, b: Vec3): Vec3
{
    const o: Vec3 = [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0]
    ];

    return o;
}

export function LengthSquared(v: Vec3): number
{
    return v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
}

export function Length(v: Vec3): number
{
    return Math.sqrt(LengthSquared(v));
}

export function Normalize(v: Vec3): Vec3
{
    const length = Length(v);
    return [v[0] / length, v[1] / length, v[2] / length];
}

export function MultiplyByMat3(m: Mat3, v: Vec3): Vec3
{
    return [
        m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2],
        m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2],
        m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2]
    ];
}