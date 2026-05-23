export type Vec2 = [number, number];

export function Add(a: Vec2, b: Vec2): Vec2
{
    return [a[0] + b[0], a[1] + b[1]];
}

export function Subtract(a: Vec2, b: Vec2): Vec2
{
    return [a[0] - b[0], a[1] - b[1]];
}

export function MultiplyScalar(v: Vec2, t: number): Vec2
{
    return [v[0] * t, v[1] * t];
}

export function LengthSquared(v: Vec2): number
{
    return v[0] * v[0] + v[1] * v[1];
}

export function Length(v: Vec2): number
{
    return Math.sqrt(LengthSquared(v));
}

export function Normalize(v: Vec2): Vec2
{
    const len = Length(v);
    return [v[0] / len, v[1] / len];
}

export function SafeNormalize(v: Vec2): Vec2
{
    if (v[0] === 0.0 && v[1] === 0.0)
    {
        return v;
    }
    return Normalize(v);
}

export function Lerp(a: Vec2, b: Vec2, t: number): Vec2
{
    const t_ = 1.0 - t;
    return [
        a[0] * t + b[0] * t_,
        a[1] * t + b[1] * t_
    ];
}