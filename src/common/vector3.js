export function Add(a, b) {
    const o = [
        a[0] + b[0],
        a[1] + b[1],
        a[2] + b[2]
    ];
    return o;
}
export function Add3(a, b, c) {
    const o = [
        a[0] + b[0] + c[0],
        a[1] + b[1] + c[1],
        a[2] + b[2] + c[2]
    ];
    return o;
}
export function Subtract(a, b) {
    const o = [
        a[0] - b[0],
        a[1] - b[1],
        a[2] - b[2]
    ];
    return o;
}
export function Multiply(a, b) {
    const o = [
        a[0] * b[0],
        a[1] * b[1],
        a[2] * b[2]
    ];
    return o;
}
export function MultiplyScalar(a, b) {
    const o = [
        a[0] * b,
        a[1] * b,
        a[2] * b
    ];
    return o;
}
export function Dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
export function CrossProduct(a, b) {
    const o = [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0]
    ];
    return o;
}
export function LengthSquared(v) {
    return v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
}
export function Length(v) {
    return Math.sqrt(LengthSquared(v));
}
export function Normalize(v) {
    const length = Length(v);
    return [v[0] / length, v[1] / length, v[2] / length];
}
export function MultiplyByMat3(m, v) {
    return [
        m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2],
        m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2],
        m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2]
    ];
}
