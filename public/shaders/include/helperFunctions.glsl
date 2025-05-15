#ifndef HELPER_FUNCTIONS
#define HELPER_FUNCTIONS

float Random(vec2 uv)
{
    return fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
}

float Lerp(float a, float b, float t, float oneMinusT)
{
    return a * oneMinusT + b * t;
}

float Lerp(float a, float b, float t)
{
    return a * (1.0 - t) + b * t;
}

vec2 Lerp(vec2 a, vec2 b, float t)
{
    float oneMinusT = 1.0 - t;
    return vec2(
        Lerp(a.x, b.x, t, oneMinusT), 
        Lerp(a.y, b.y, t, oneMinusT));
}

vec3 Lerp(vec3 a, vec3 b, float t)
{
    float oneMinusT = 1.0 - t;
    return vec3(
        Lerp(a.x, b.x, t, oneMinusT), 
        Lerp(a.y, b.y, t, oneMinusT), 
        Lerp(a.z, b.z, t, oneMinusT));
}

vec4 Lerp(vec4 a, vec4 b, float t)
{
    float oneMinusT = 1.0 - t;
    return vec4(
        Lerp(a.x, b.x, t, oneMinusT), 
        Lerp(a.y, b.y, t, oneMinusT), 
        Lerp(a.z, b.z, t, oneMinusT), 
        Lerp(a.w, b.w, t, oneMinusT));
}

vec2 RotateVec2(vec2 v, float theta)
{
    float c = cos(theta);
    float s = sin(theta);
    return vec2(v.x * c - v.y * s, v.x * s + v.y * c);
}

#endif // HELPER_FUNCTIONS