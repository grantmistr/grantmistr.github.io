#ifndef HELPER_FUNCTIONS
#define HELPER_FUNCTIONS

#define PI 3.14159265359
#define TAU 6.28318530718
#define PHI 2.39996323

const vec3 UP = vec3(0.0, 1.0, 0.0);
const float INFINITY = 1.0 / 0.0;
const float EPSILON = 1e-12;

float Random(float x)
{
    return fract(sin(x * 78.233) * 43758.5453);
}

float Random(vec2 uv)
{
    return fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
}

float Random(vec3 v)
{
    return fract(sin(dot(v, vec3(12.9898, 78.233, 33.2991))) * 43758.5453);
}

uint WangHash(uint seed)
{
    seed = (seed ^ 61u) ^ (seed >> 16u);
    seed *= 9u;
    seed = seed ^ (seed >> 4u);
    seed *= 0x27d4eb2du;
    seed = seed ^ (seed >> 15u);
    
    return seed;
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

float Clamp01(float x)
{
    return clamp(x, 0.0, 1.0);
}

vec2 RotateVec2(vec2 v, float theta)
{
    float c = cos(theta);
    float s = sin(theta);
    return vec2(v.x * c - v.y * s, v.x * s + v.y * c);
}

mat2x2 GetRotationMatrix2x2(float theta)
{
    float c = cos(theta);
    float s = sin(theta);
    return mat2x2(c, -s, s, c);
}

float InverseLerp(float a, float b, float t)
{
    return (t - a) / (b - a);
}

float LengthSquared(vec3 v)
{
    return v.x * v.x + v.y * v.y + v.z * v.z;
}

float InterleavedGradientNoise(vec2 coord)
{
    return fract(52.982919 * fract(dot(vec2(0.06711, 0.00584), coord)));
}

float Luminance(vec3 color)
{
    return 0.2126 * color.x + 0.7152 * color.y + 0.0722 * color.z;
}

vec3 TransformToViewSpace(mat4 invProjMatrix, mat3 invViewMatrix, vec2 posNDC)
{
    vec4 t = vec4(posNDC.x, posNDC.y, -1.0, 1.0);

    float x = invProjMatrix[0][0] * t[0];
    float y = invProjMatrix[1][1] * t[1];
    float z = invProjMatrix[2][3] * t[3];
    float w = invProjMatrix[3][2] * t[2] + invProjMatrix[3][3] * t[3];

    vec3 v = vec3(x, y, z) / w;
    return invViewMatrix * v;
}

#endif // HELPER_FUNCTIONS