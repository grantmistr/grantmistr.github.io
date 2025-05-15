#version 300 es

precision highp float;

uniform float uTime;
uniform vec2 uScreenSize;

out vec4 fragColor;

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

void main()
{
    float aspect = uScreenSize.x / uScreenSize.y;

    vec2 pos01 = vec2(gl_FragCoord.x / uScreenSize.x, gl_FragCoord.y / uScreenSize.y);
    vec2 posNDC = vec2(pos01.x * 2.0 - 1.0, pos01.y * 2.0 - 1.0);
    vec2 posNDCAspect = vec2(posNDC.x * aspect, posNDC.y);
    vec2 posRot = RotateVec2(posNDCAspect, uTime * 0.00001);
    vec2 offset = vec2(uTime, uTime);
    vec2 checker = vec2(fract(posRot.x * 20.0), fract(posRot.y * 20.0));

    vec2 c0 = vec2(16.0 * checker.x - 8.0, 16.0 * checker.y - 8.0);
    c0 = vec2(c0.x * c0.x, c0.y * c0.y);
    c0 = vec2(1.0 - c0.x, 1.0 - c0.y);
    c0.x = clamp(c0.x, 0.0, 1.0);
    c0.y = clamp(c0.y, 0.0, 1.0);
    
    vec2 c1 = vec2(4.0 * checker.x - 2.0, 4.0 * checker.y - 2.0);
    c1 = vec2(c1.x * c1.x, c1.y * c1.y);
    c1 = vec2(c1.x * c1.x, c1.y * c1.y);
    c1 = vec2(c1.x * c1.x, c1.y * c1.y);
    c1.x = clamp(c1.x, 0.0, 1.0);
    c1.y = clamp(c1.y, 0.0, 1.0);
    
    float c = c0.x * c1.y + c0.y * c1.x;
    c *= length(posNDCAspect);

    float r = Random(pos01);

    vec3 color0 = Lerp(vec3(0.1, 0.1, 0.0), vec3(0.4, 0.2, 0.1), dot(posNDC, vec2(0.25, -0.25)) + r * 0.05);
    vec3 color1 = vec3(pos01.x * c, pos01.y * c, 0.0);
    vec3 color = Lerp(color0, color1, c * 0.25);

    fragColor = vec4(color.x, color.y, color.z, 1.0);
}