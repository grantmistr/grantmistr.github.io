#version 300 es

precision highp float;

in vec3 vColor;

uniform float uTime;
uniform vec2 uScreenSize;
uniform vec2 uMousePosition;

out vec4 fragColor;

float Random(float x)
{
    return fract(sin(x * 37.0) * 104003.9);
}

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

vec3 HueShift(vec3 color, float t)
{
    return vec3(0.0, 0.0, 0.0);
}

void main()
{
    vec2 mouseDelta = vec2(uMousePosition.x, uScreenSize.y - uMousePosition.y) - vec2(gl_FragCoord.x, gl_FragCoord.y);
    float mouseMask = max(1.0 - length(mouseDelta) * 0.01, 0.0);

    float aspect = uScreenSize.x / uScreenSize.y;

    vec2 pos01 = vec2(gl_FragCoord.x / uScreenSize.x, gl_FragCoord.y / uScreenSize.y);
    vec2 posNDC = vec2(pos01.x * 2.0 - 1.0, pos01.y * 2.0 - 1.0);
    vec2 posNDCAspect = vec2(posNDC.x * aspect, posNDC.y);
    vec2 posNDCAspectRot = RotateVec2(posNDCAspect, uTime * 0.00001);

    vec2 mousePos01 = vec2(uMousePosition.x / uScreenSize.x, 1.0 - uMousePosition.y / uScreenSize.y);
    vec2 mousePosNDC = vec2(mousePos01.x * 2.0 - 1.0, mousePos01.y * 2.0 - 1.0);
    vec2 mousePosNDCAspect = vec2(mousePosNDC.x * aspect, mousePosNDC.y);
    vec2 mousePosNDCAspectRot = RotateVec2(mousePosNDCAspect, uTime * 0.00001);

    float r = Random(pos01); // per-pixel random for dithering and stuff

    float scale = 15.0;

    vec2 scaledMousePosNDC = vec2(mousePosNDCAspectRot.x * scale, mousePosNDCAspectRot.y * scale);

    vec2 scaledPosNDC = vec2(posNDCAspectRot.x * scale, posNDCAspectRot.y * scale);
    vec2 flooredScaledPosNDC = vec2(floor(scaledPosNDC.x), floor(scaledPosNDC.y));
    vec2 cellCenter = vec2(flooredScaledPosNDC.x + 0.5, flooredScaledPosNDC.y + 0.5);

    float mouseInfluence = length(scaledMousePosNDC - cellCenter);
    mouseInfluence = max(1.0 - mouseInfluence * 0.25, 0.0);

    float randIndex = Random(flooredScaledPosNDC);
    vec2 tiledPos01 = vec2(fract(scaledPosNDC.x), fract(scaledPosNDC.y));
    vec2 tiledPosNDC = vec2(tiledPos01.x * 2.0 - 1.0, tiledPos01.y * 2.0 - 1.0);
    vec2 tiledPosRot = RotateVec2(tiledPosNDC, (uTime * 0.0005 * (1.0 + randIndex) + randIndex * 6.28 + mouseInfluence * 6.28) * (Random(randIndex) > 0.5 ? 1.0 : -1.0));

    vec2 c0 = vec2(
        pow(max(1.0 - tiledPosRot.x * tiledPosRot.x, 0.0), 64.0),
        pow(max(1.0 - tiledPosRot.y * tiledPosRot.y, 0.0), 64.0));
    float c = length(tiledPosRot * (1.2 - mouseInfluence * 0.25));
    c *= c;
    c *= c;
    c = max(1.0 - c, 0.0);
    c0.x *= c;
    c0.y *= c;

    float t = c * 0.25 + c0.x * (0.25 + mouseInfluence * 0.75);
    vec3 color0 = Lerp(vec3(0.1, 0.1, 0.0), vec3(0.4, 0.2, 0.1), dot(posNDC, vec2(0.25, -0.25)) + r * 0.05);
    vec3 color1 = vColor;
    vec3 color = Lerp(color0, color1, t * (0.25 + mouseInfluence * 0.05));

    fragColor = vec4(color.x, color.y, color.z, 1.0);
}