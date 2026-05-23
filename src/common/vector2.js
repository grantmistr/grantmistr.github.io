export function Add(a, b) {
    return [a[0] + b[0], a[1] + b[1]];
}
export function Subtract(a, b) {
    return [a[0] - b[0], a[1] - b[1]];
}
export function MultiplyScalar(v, t) {
    return [v[0] * t, v[1] * t];
}
export function LengthSquared(v) {
    return v[0] * v[0] + v[1] * v[1];
}
export function Length(v) {
    return Math.sqrt(LengthSquared(v));
}
export function Normalize(v) {
    const len = Length(v);
    return [v[0] / len, v[1] / len];
}
export function SafeNormalize(v) {
    if (v[0] === 0.0 && v[1] === 0.0) {
        return v;
    }
    return Normalize(v);
}
export function Lerp(a, b, t) {
    const t_ = 1.0 - t;
    return [
        a[0] * t + b[0] * t_,
        a[1] * t + b[1] * t_
    ];
}
