#version 300 es

precision highp float;

in vec3 vColor;

uniform float uTime;
uniform float uMouseClickTime;
uniform vec2 uScreenSize;
uniform vec2 uMousePosition;
uniform vec2 uMouseClickPosition;

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

float SteppedTime(float interval, float slope, float offset)
{
    float a = (uTime + offset) / slope;
    float b = floor(a / interval);
    float c = interval - 1.0;
    float d = a - b * c - c;

    return max(b, d);
}

float SteppedTime(float interval, float slope, float offset, out float changeMask)
{
    float a = (uTime + offset) / slope;
    float b = floor(a / interval);
    float c = interval - 1.0;
    float d = a - b * c - c;

    changeMask = interval * slope;
    changeMask = mod(2.0 * (uTime + offset) - changeMask, 2.0 * changeMask) / slope - c;
    changeMask = 1.0 - changeMask * changeMask;
    changeMask = max(changeMask, 0.0);

    return max(b, d);
}

vec2 GetCell(vec2 coord)
{
    return vec2(floor(coord.x), floor(coord.y));
}

vec2 GetCellOffset(vec2 cell, float slope, float interval)
{
    float rX = Random(cell.y);
    float h = floor(rX * interval * 0.5) * 2.0; // horizontal random offsets even
    h = SteppedTime(interval, slope, h * slope) * (Random(rX) > 0.5 ? 1.0 : -1.0);

    float rY = Random(cell.x);
    float v = floor(rY * interval * 0.5) * 2.0 + 1.0; // vertical random offsets odd
    v = SteppedTime(interval, slope, v * slope) * (Random(rY) > 0.5 ? 1.0 : -1.0);

    return vec2(h, v);
}

vec2 GetCellOffset(vec2 cell, float slope, float interval, out float changeMask)
{
    float changeMaskX;
    float rX = Random(cell.y);
    float h = floor(rX * interval * 0.5) * 2.0; // horizontal random offsets even
    h = SteppedTime(interval, slope, h * slope, changeMaskX) * (Random(rX) > 0.5 ? 1.0 : -1.0);

    float changeMaskY;
    float rY = Random(cell.x);
    float v = floor(rY * interval * 0.5) * 2.0 + 1.0; // vertical random offsets odd
    v = SteppedTime(interval, slope, v * slope, changeMaskY) * (Random(rY) > 0.5 ? 1.0 : -1.0);

    changeMask = changeMaskX + changeMaskY;

    return vec2(h, v);
}

vec2 GetOffsetCell(vec2 cell, vec2 posNDC, float slope, float interval)
{
    vec2 offset = GetCellOffset(cell, slope, interval);
    cell = GetCell(posNDC + offset);
    return cell;
}

vec2 GetOffsetCell(vec2 cell, vec2 posNDC, float slope, float interval, out float changeMask)
{
    vec2 offset = GetCellOffset(cell, slope, interval, changeMask);
    cell = GetCell(posNDC + offset);
    return cell;
}

float GetCellMask(vec2 coord, float slope, float interval)
{
    vec2 cell = GetCell(coord);

    vec2 SW = vec2(-1.0, -1.0);
    SW = GetOffsetCell(cell + SW, coord + SW, slope, interval);
    vec2 S = vec2(0.0, -1.0);
    S = GetOffsetCell(cell + S, coord + S, slope, interval);
    vec2 SE = vec2(1.0, -1.0);
    SE = GetOffsetCell(cell + SE, coord + SE, slope, interval);
    vec2 E = vec2(1.0, 0.0);
    E = GetOffsetCell(cell + E, coord + E, slope, interval);
    vec2 NE = vec2(1.0, 1.0);
    NE = GetOffsetCell(cell + NE, coord + NE, slope, interval);
    vec2 N = vec2(0.0, 1.0);
    N = GetOffsetCell(cell + N, coord + N, slope, interval);
    vec2 NW = vec2(-1.0, 1.0);
    NW = GetOffsetCell(cell + NW, coord + NW, slope, interval);
    vec2 W = vec2(-1.0, 0.0);
    W = GetOffsetCell(cell + W, coord + W, slope, interval);

    float changeMask;
    vec2 offset = GetCellOffset(cell, slope, interval, changeMask);
    coord += offset;
    cell = GetCell(coord);

    bool rSW = Random(SW) > 0.5;
    bool rS = Random(S)   > 0.5;
    bool rSE = Random(SE) > 0.5;
    bool rE = Random(E)   > 0.5;
    bool rNE = Random(NE) > 0.5;
    bool rN = Random(N)   > 0.5;
    bool rNW = Random(NW) > 0.5;
    bool rW = Random(W)   > 0.5;

    coord = fract(coord);
    coord = vec2(coord.x * 2.0 - 1.0, coord.y * 2.0 - 1.0);

    float l = length(coord);
    bool circleMask = l >= 1.0;

    bool qSW = coord.x < 0.0 && coord.y < 0.0 && circleMask;
    bool qSE = coord.x > 0.0 && coord.y < 0.0 && circleMask;
    bool qNW = coord.x < 0.0 && coord.y > 0.0 && circleMask;
    bool qNE = coord.x > 0.0 && coord.y > 0.0 && circleMask;

    bool m1 =   (rS && rE) ? qSE : false;
    m1 = m1 || ((rE && rN) ? qNE : false);
    m1 = m1 || ((rN && rW) ? qNW : false);
    m1 = m1 || ((rW && rS) ? qSW : false);

    bool m2 =   (!rS && !rE && !rSE) ? !qSE : true;
    m2 = m2 && ((!rE && !rN && !rNE) ? !qNE : true);
    m2 = m2 && ((!rN && !rW && !rNW) ? !qNW : true);
    m2 = m2 && ((!rW && !rS && !rSW) ? !qSW : true);

    bool r = Random(cell) > 0.5;

    float o1 = m1 ? 1.0 : 0.0;
    float o2 = m2 ? 1.0 : 0.0;
    float o = r ? o2 : o1;

    return o;
}

float GetCellMask1(vec2 coord, float slope, float interval)
{
    float threshHold = 0.5;

    vec2 cell = GetCell(coord);

    vec2 SW = vec2(-1.0, -1.0);
    SW = cell + SW;
    vec2 S = vec2(0.0, -1.0);
    S = cell + S;
    vec2 SE = vec2(1.0, -1.0);
    SE = cell + SE;
    vec2 E = vec2(1.0, 0.0);
    E = cell + E;
    vec2 NE = vec2(1.0, 1.0);
    NE = cell + NE;
    vec2 N = vec2(0.0, 1.0);
    N = cell + N;
    vec2 NW = vec2(-1.0, 1.0);
    NW = cell + NW;
    vec2 W = vec2(-1.0, 0.0);
    W = cell + W;

    bool rSW = Random(SW) > threshHold;
    bool rS = Random(S)   > threshHold;
    bool rSE = Random(SE) > threshHold;
    bool rE = Random(E)   > threshHold;
    bool rNE = Random(NE) > threshHold;
    bool rN = Random(N)   > threshHold;
    bool rNW = Random(NW) > threshHold;
    bool rW = Random(W)   > threshHold;

    vec2 pos01 = fract(coord);
    vec2 posNDC = vec2(pos01.x * 2.0 - 1.0, pos01.y * 2.0 - 1.0);

    float l = length(posNDC);

    bool qSW = posNDC.x < 0.0 && posNDC.y < 0.0;
    bool qSE = posNDC.x > 0.0 && posNDC.y < 0.0;
    bool qNW = posNDC.x < 0.0 && posNDC.y > 0.0;
    bool qNE = posNDC.x > 0.0 && posNDC.y > 0.0;

    float c1 = l;

    c1 = rS ? c1 : min(c1, distance(pos01, vec2(0.5, clamp(pos01.y, 0.0, 0.5))) * 2.0);
    c1 = rN ? c1 : min(c1, distance(pos01, vec2(0.5, clamp(pos01.y, 0.5, 1.0))) * 2.0);
    c1 = rW ? c1 : min(c1, distance(pos01, vec2(clamp(pos01.x, 0.0, 0.5), 0.5)) * 2.0);
    c1 = rE ? c1 : min(c1, distance(pos01, vec2(clamp(pos01.x, 0.5, 1.0), 0.5)) * 2.0);

    c1 = (rSW || rS || rW) ? c1 : c1 * (qSW ? 0.0 : 1.0);
    c1 = (rSE || rS || rE) ? c1 : c1 * (qSE ? 0.0 : 1.0);
    c1 = (rNW || rN || rW) ? c1 : c1 * (qNW ? 0.0 : 1.0);
    c1 = (rNE || rN || rE) ? c1 : c1 * (qNE ? 0.0 : 1.0);

    c1 = (!rS && !rW && rSW && qSW) ? (1.0 - length(pos01) * 2.0) : c1;
    c1 = (!rS && !rE && rSE && qSE) ? (1.0 - length(vec2(pos01.x - 1.0, pos01.y)) * 2.0) : c1;
    c1 = (!rN && !rW && rNW && qNW) ? (1.0 - length(vec2(pos01.x, pos01.y - 1.0)) * 2.0) : c1;
    c1 = (!rN && !rE && rNE && qNE) ? (1.0 - length(vec2(pos01.x - 1.0, pos01.y - 1.0)) * 2.0) : c1;

    c1 = clamp(c1, 0.0, 1.0);

    bool r = Random(cell) > threshHold;

    float o = r ? 1.0 : c1;

    return o * o * (3.0 + 2.0 * o) * 0.15;
}

float GetCellMask2(vec2 coord, float slope, float interval)
{
    vec2 cell = GetCell(coord);

    vec2 SW = vec2(-1.0, -1.0);
    SW = GetOffsetCell(cell + SW, coord + SW, slope, interval);
    vec2 S = vec2(0.0, -1.0);
    S = GetOffsetCell(cell + S, coord + S, slope, interval);
    vec2 SE = vec2(1.0, -1.0);
    SE = GetOffsetCell(cell + SE, coord + SE, slope, interval);
    vec2 E = vec2(1.0, 0.0);
    E = GetOffsetCell(cell + E, coord + E, slope, interval);
    vec2 NE = vec2(1.0, 1.0);
    NE = GetOffsetCell(cell + NE, coord + NE, slope, interval);
    vec2 N = vec2(0.0, 1.0);
    N = GetOffsetCell(cell + N, coord + N, slope, interval);
    vec2 NW = vec2(-1.0, 1.0);
    NW = GetOffsetCell(cell + NW, coord + NW, slope, interval);
    vec2 W = vec2(-1.0, 0.0);
    W = GetOffsetCell(cell + W, coord + W, slope, interval);

    vec2 offset = GetCellOffset(cell, slope, interval);
    coord += offset;
    cell = GetCell(coord);

    bool rSW = Random(SW) > 0.5;
    bool rS = Random(S)   > 0.5;
    bool rSE = Random(SE) > 0.5;
    bool rE = Random(E)   > 0.5;
    bool rNE = Random(NE) > 0.5;
    bool rN = Random(N)   > 0.5;
    bool rNW = Random(NW) > 0.5;
    bool rW = Random(W)   > 0.5;

    vec2 pos01 = fract(coord);
    vec2 posNDC = vec2(pos01.x * 2.0 - 1.0, pos01.y * 2.0 - 1.0);

    float l = length(posNDC);

    bool qSW = posNDC.x < 0.0 && posNDC.y < 0.0;
    bool qSE = posNDC.x > 0.0 && posNDC.y < 0.0;
    bool qNW = posNDC.x < 0.0 && posNDC.y > 0.0;
    bool qNE = posNDC.x > 0.0 && posNDC.y > 0.0;

    float c1 = l;

    c1 = rS ? c1 : min(c1, distance(pos01, vec2(0.5, clamp(pos01.y, 0.0, 0.5))) * 2.0);
    c1 = rN ? c1 : min(c1, distance(pos01, vec2(0.5, clamp(pos01.y, 0.5, 1.0))) * 2.0);
    c1 = rW ? c1 : min(c1, distance(pos01, vec2(clamp(pos01.x, 0.0, 0.5), 0.5)) * 2.0);
    c1 = rE ? c1 : min(c1, distance(pos01, vec2(clamp(pos01.x, 0.5, 1.0), 0.5)) * 2.0);

    c1 = (rSW || rS || rW) ? c1 : c1 * (qSW ? 0.0 : 1.0);
    c1 = (rSE || rS || rE) ? c1 : c1 * (qSE ? 0.0 : 1.0);
    c1 = (rNW || rN || rW) ? c1 : c1 * (qNW ? 0.0 : 1.0);
    c1 = (rNE || rN || rE) ? c1 : c1 * (qNE ? 0.0 : 1.0);

    c1 = (!rS && !rW && rSW && qSW) ? (1.0 - length(pos01) * 2.0) : c1;
    c1 = (!rS && !rE && rSE && qSE) ? (1.0 - length(vec2(pos01.x - 1.0, pos01.y)) * 2.0) : c1;
    c1 = (!rN && !rW && rNW && qNW) ? (1.0 - length(vec2(pos01.x, pos01.y - 1.0)) * 2.0) : c1;
    c1 = (!rN && !rE && rNE && qNE) ? (1.0 - length(vec2(pos01.x - 1.0, pos01.y - 1.0)) * 2.0) : c1;

    bool r = Random(cell) > 0.5;

    float o = r ? 1.0 : c1;

    return o;
}

float GetCellMask3(vec2 coord, float slope, float interval)
{
    float threshHold = 0.5;

    vec2 cell = GetCell(coord);

    vec2 SW = vec2(-1.0, -1.0);
    SW = cell + SW;
    vec2 S = vec2(0.0, -1.0);
    S = cell + S;
    vec2 SE = vec2(1.0, -1.0);
    SE = cell + SE;
    vec2 E = vec2(1.0, 0.0);
    E = cell + E;
    vec2 NE = vec2(1.0, 1.0);
    NE = cell + NE;
    vec2 N = vec2(0.0, 1.0);
    N = cell + N;
    vec2 NW = vec2(-1.0, 1.0);
    NW = cell + NW;
    vec2 W = vec2(-1.0, 0.0);
    W = cell + W;

    bool rSW = Random(SW) > threshHold;
    bool rS = Random(S)   > threshHold;
    bool rSE = Random(SE) > threshHold;
    bool rE = Random(E)   > threshHold;
    bool rNE = Random(NE) > threshHold;
    bool rN = Random(N)   > threshHold;
    bool rNW = Random(NW) > threshHold;
    bool rW = Random(W)   > threshHold;

    coord = fract(coord);
    coord = vec2(coord.x * 2.0 - 1.0, coord.y * 2.0 - 1.0);

    float l = length(coord);
    bool circleMask = l >= 1.0;

    bool qSW = coord.x < 0.0 && coord.y < 0.0 && circleMask;
    bool qSE = coord.x > 0.0 && coord.y < 0.0 && circleMask;
    bool qNW = coord.x < 0.0 && coord.y > 0.0 && circleMask;
    bool qNE = coord.x > 0.0 && coord.y > 0.0 && circleMask;

    bool m1 =   (rS && rE) ? qSE : false;
    m1 = m1 || ((rE && rN) ? qNE : false);
    m1 = m1 || ((rN && rW) ? qNW : false);
    m1 = m1 || ((rW && rS) ? qSW : false);

    bool m2 =   (!rS && !rE && !rSE) ? !qSE : true;
    m2 = m2 && ((!rE && !rN && !rNE) ? !qNE : true);
    m2 = m2 && ((!rN && !rW && !rNW) ? !qNW : true);
    m2 = m2 && ((!rW && !rS && !rSW) ? !qSW : true);

    bool r = Random(cell) > threshHold;

    float o1 = m1 ? 1.0 : 0.0;
    float o2 = m2 ? 1.0 : 0.0;
    float o = r ? o2 : o1;

    return o;
}

void main()
{
    float aspect = uScreenSize.x / uScreenSize.y;

    float scale = 20.0;
    float slope = 2000.0;
    float interval = scale * 2.0;

    float rotationSpeed = 0.00001;
    float rotation = uTime * rotationSpeed;

    vec2 pos01 = vec2(gl_FragCoord.x / uScreenSize.x, gl_FragCoord.y / uScreenSize.y);
    vec2 posNDC = vec2(pos01.x * 2.0 - 1.0, pos01.y * 2.0 - 1.0);
    vec2 posNDCAspect = vec2(posNDC.x * aspect, posNDC.y);
    vec2 posNDCAspectRot = RotateVec2(posNDCAspect, rotation);
    vec2 posNDCAspectRotScaled = vec2(posNDCAspectRot.x * scale, posNDCAspectRot.y * scale);
    vec2 tiledPos01 = vec2(fract(posNDCAspectRotScaled.x), fract(posNDCAspectRotScaled.y));
    vec2 tiledPosNDC = vec2(tiledPos01.x * 2.0 - 1.0, tiledPos01.y * 2.0 - 1.0);

    vec2 mousePos01 = vec2(uMousePosition.x / uScreenSize.x, 1.0 - uMousePosition.y / uScreenSize.y);
    vec2 mousePosNDC = vec2(mousePos01.x * 2.0 - 1.0, mousePos01.y * 2.0 - 1.0);
    vec2 mousePosNDCAspect = vec2(mousePosNDC.x * aspect, mousePosNDC.y);
    vec2 mousePosNDCAspectRot = RotateVec2(mousePosNDCAspect, rotation);
    vec2 mousePosNDCAspectRotScaled = vec2(mousePosNDCAspectRot.x * scale, mousePosNDCAspectRot.y * scale);

    vec2 mouseClickPos01 = vec2(uMouseClickPosition.x / uScreenSize.x, 1.0 - uMouseClickPosition.y / uScreenSize.y);
    vec2 mouseClickPosNDC = vec2(mouseClickPos01.x * 2.0 - 1.0, mouseClickPos01.y * 2.0 - 1.0);
    vec2 mouseClickPosNDCAspect = vec2(mouseClickPosNDC.x * aspect, mouseClickPosNDC.y);
    vec2 mouseClickPosNDCAspectRot = RotateVec2(mouseClickPosNDCAspect, rotation);
    vec2 mouseClickPosNDCAspectRotScaled = vec2(mouseClickPosNDCAspectRot.x * scale, mouseClickPosNDCAspectRot.y * scale);

    float cMask = GetCellMask3(posNDCAspectRotScaled, slope, interval);

    vec2 cell = GetCell(posNDCAspectRotScaled);
    //float cell1D = cell.x + cell.y * scale * 2.0;

    float rX = Random(cell.y);
    float h = floor(rX * interval * 0.5) * 2.0; // horizontal random offsets even
    h = SteppedTime(interval, slope, h * slope) * (Random(rX) > 0.5 ? 1.0 : -1.0);
    posNDCAspectRotScaled.x += h;

    cell = GetCell(posNDCAspectRotScaled);

    float rY = Random(-cell.x);
    float v = floor(rY * interval * 0.5) * 2.0 + 1.0; // vertical random offsets odd
    v = SteppedTime(interval, slope, v * slope) * (Random(rY) > 0.5 ? 1.0 : -1.0);
    posNDCAspectRotScaled.y += v;

    float changeMask;
    vec2 offset = GetCellOffset(cell, slope, interval, changeMask);

    cell = vec2(floor(posNDCAspectRotScaled.x), floor(posNDCAspectRotScaled.y));
    vec2 cellCenter = vec2(cell.x + 0.5, cell.y + 0.5);

    mousePosNDCAspectRotScaled.x += h;
    mousePosNDCAspectRotScaled.y += v;
    float mouseInfluence = length(mousePosNDCAspectRotScaled - cellCenter);
    mouseInfluence = max(1.0 - mouseInfluence * 0.25, 0.0);
    mouseInfluence = 0.0;

    mouseClickPosNDCAspectRotScaled.x += h;
    mouseClickPosNDCAspectRotScaled.y += v;
    float mouseClickInfluence = length(mouseClickPosNDCAspectRotScaled - cellCenter) < ((uTime - uMouseClickTime) * 0.01) ? 1.0 : 0.0;
    mouseClickInfluence *= max(1.0 - (uTime - uMouseClickTime) * 0.001, 0.0);

    mouseInfluence += mouseClickInfluence;

    float cellRand = 0.5 - Random(cell);
    tiledPos01 = vec2(fract(posNDCAspectRotScaled.x), fract(posNDCAspectRotScaled.y));
    tiledPosNDC = vec2(tiledPos01.x * 2.0 - 1.0, tiledPos01.y * 2.0 - 1.0);
    //vec2 tiledPosRot = RotateVec2(tiledPosNDC, uTime * 0.001 * cellRand + (cellRand * 6.28) + (mouseInfluence * 6.28 * (cellRand > 0.0 ? 1.0 : -1.0)));

    float c = length(tiledPosNDC) * (1.2 - mouseInfluence * 0.25); // circle size increase with mouse influence
    c *= c;
    c *= c;
    c = max(1.0 - c, 0.0);
    c = 1.0;
    c *= (cellRand > 0.0 ? 1.0 : 0.0);

    float perPixelRandom = Random(pos01); // per-pixel random for dithering and stuff

    float t = (c + mouseInfluence * c * 0.5) * (0.1 + changeMask * 0.1); // brighter color with mouse influence
    vec3 color0 = Lerp(vec3(0.1, 0.1, 0.0), vec3(0.4, 0.2, 0.1), dot(posNDC, vec2(0.25, -0.25)) + perPixelRandom * 0.03);
    vec3 color1 = vColor;
    vec3 color = Lerp(color0, color1, cMask * 0.2);

    fragColor = vec4(color.x, color.y, color.z, 1.0);
    //fragColor = vec4(tiledPos01.x * 0.1, tiledPos01.y * 0.1, 0.0, 1.0);
    //fragColor = vec4(cMask, 0.0, 0.0, 1.0);
}