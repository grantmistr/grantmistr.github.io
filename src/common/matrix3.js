export const IDENTITY = [[1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 1.0]];
export function Transpose(m) {
    return [
        [m[0][0], m[1][0], m[2][0]],
        [m[0][1], m[1][1], m[2][1]],
        [m[0][2], m[1][2], m[2][2]]
    ];
}
export function MultiplyByMat3(a, b) {
    return [
        [
            a[0][0] * b[0][0] + a[0][1] * b[1][0] + a[0][2] * b[2][0],
            a[0][0] * b[0][1] + a[0][1] * b[1][1] + a[0][2] * b[2][1],
            a[0][0] * b[0][2] + a[0][1] * b[1][2] + a[0][2] * b[2][2],
        ],
        [
            a[1][0] * b[0][0] + a[1][1] * b[1][0] + a[1][2] * b[2][0],
            a[1][0] * b[0][1] + a[1][1] * b[1][1] + a[1][2] * b[2][1],
            a[1][0] * b[0][2] + a[1][1] * b[1][2] + a[1][2] * b[2][2],
        ],
        [
            a[2][0] * b[0][0] + a[2][1] * b[1][0] + a[2][2] * b[2][0],
            a[2][0] * b[0][1] + a[2][1] * b[1][1] + a[2][2] * b[2][1],
            a[2][0] * b[0][2] + a[2][1] * b[1][2] + a[2][2] * b[2][2],
        ],
    ];
}
export function RotationMatrixFromAxisAndAngle(a, theta) {
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    const t = 1.0 - c;
    const o = [
        [a[0] * a[0] * t + c, a[0] * a[1] * t - a[2] * s, a[0] * a[2] * t + a[1] * s],
        [a[0] * a[1] * t + a[2] * s, a[1] * a[1] * t + c, a[1] * a[2] * t - a[0] * s],
        [a[0] * a[2] * t - a[1] * s, a[1] * a[2] * t + a[0] * s, a[2] * a[2] * t + c]
    ];
    return o;
}
export function ToFloat32List(m) {
    return [m[0][0], m[0][1], m[0][2], m[1][0], m[1][1], m[1][2], m[2][0], m[2][1], m[2][2]];
}
