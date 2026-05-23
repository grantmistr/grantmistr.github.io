#version 300 es

precision highp float;

#include "../include/helperFunctions.glsl"
#include "../include/sdfFunctions.glsl"
#include "../include/camera.glsl"
//#include "../include/coordData.glsl"
#include "../include/primitive.glsl"

const int RAYMARCH_ITERATIONS = 24;
const int F_SPHERE_COUNT = 8;
const vec3 MAIN_SPHERE_POSITION = vec3(0.0, 0.0, 15.0);
const float MAIN_SPHERE_RADIUS = 4.0;
const float F_SPHERE_RADIUS = 0.8;
const float MOUSE_INFLUENCE_RADIUS_MULTIPLIER = 0.3;
const float CAMERA_DISTANCE = 12.0;
const float CAMERA_DISTANCE_INV = 1.0 / CAMERA_DISTANCE;
const float CAMERA_FOV = 60.0 * (PI / 180.0);
const float LIGHT_BEAM_FALLOFF_DISTANCE = CAMERA_DISTANCE * 0.5;
const float LIGHT_BEAM_FALLOFF_DISTANCE_INV = 1.0 / LIGHT_BEAM_FALLOFF_DISTANCE;
const float PARTICLE_SPEED = 0.0006;

const vec3[] F_SPHERE_DIRECTIONS = vec3[F_SPHERE_COUNT] // fibonacci lattice
(
    //vec3(0.0, 1.0, 0.0),
    vec3(-0.46346536360418095, 0.7777777777777778, 0.42457223782803555),
    vec3(0.07269269126757281, 0.5555555555555556, -0.8282957185254766),
    vec3(0.5736416587716867, 0.33333333333333337, 0.7482139641910973),
    vec3(-0.9786161293792442, 0.11111111111111116, -0.17310341506290514),
    vec3(0.8385307543129759, -0.11111111111111116, -0.5334046260194656),
    vec3(-0.2447572873770948, -0.33333333333333326, 0.9104849033150935),
    vec3(-0.3832347038505953, -0.5555555555555556, -0.737895105320468),
    vec3(0.5904004069485942, -0.7777777777777777, 0.21561328314831707)
    //vec3(-0.0, -1.0, 0.0)
);

const vec3[] CYLINDER_COLORS = vec3[F_SPHERE_COUNT] // all equal luminance
(
    vec3(0.0420385918617195, 0.07297308976504752, 0.15335514640216688),
    vec3(0.027966274342227017, 0.09069053872787809, 0.01928665895656689),
    vec3(0.09507390917727052, 0.0700702851583557, 0.02594209090936705),
    vec3(0.02684174326403091, 0.08541177903327875, 0.07488837974329729),
    vec3(0.18812894994362567, 0.0316515895651475, 0.13250094716054978),
    vec3(0.23285393892856812, 0.02941717412324443, 0.022937529790055384),
    vec3(0.25942364305525556, 0.015096595002341392, 0.0865574617836301),
    vec3(0.06573178008505788, 0.0704076172530791, 0.10900132540878853)
);

uniform float uTime;
uniform vec2 uScreenSize;
uniform vec2 uMousePosition;
uniform mat3 uSphereRotationMatrix; 
uniform vec4 uFSphereDirections[F_SPHERE_COUNT]; // F_SPHERE_DIRECTIONS rotated by the uSphereRotationMatrix; w component has mouse influence
uniform mat4 uInvProjMatrix;
uniform mat3 uInvViewMatrix;
uniform vec3 uCameraPosition;

out vec4 fragColor;

vec3 fibonacciSphere(int i, int n)
{
    float phi = 2.39996323; // golden angle

    float y = 1.0 - (float(i) / float(n - 1)) * 2.0; // from 1 to -1
    float radius = sqrt(1.0 - y * y);

    float theta = phi * float(i);

    float x = cos(theta) * radius;
    float z = sin(theta) * radius;

    return vec3(x, y, z);
}

float DistanceCheck(vec3 pos, out float holeMask)
{
    vec3 posRot = uSphereRotationMatrix * pos;

    vec3 sphereToRayDelta = pos - MAIN_SPHERE_POSITION;
    int fSphereIndex = 0;
    float closestDir = dot(sphereToRayDelta, uFSphereDirections[fSphereIndex].xyz);

    // get closest fibonacci lattice point
    for (int i = 1; i < F_SPHERE_COUNT; i++)
    {
        float dirCheck = dot(sphereToRayDelta, uFSphereDirections[i].xyz);
        if (dirCheck > closestDir)
        {
            closestDir = dirCheck;
            fSphereIndex = i;
        }
    }

    vec3 fSpherePos = uFSphereDirections[fSphereIndex].xyz * MAIN_SPHERE_RADIUS * (0.9 + uFSphereDirections[fSphereIndex].w * 0.1);
    vec3 fSphereCutoutPos = fSpherePos * 1.2 + MAIN_SPHERE_POSITION;
    fSpherePos += MAIN_SPHERE_POSITION;

    float fSphereRadius = F_SPHERE_RADIUS + uFSphereDirections[fSphereIndex].w * MOUSE_INFLUENCE_RADIUS_MULTIPLIER;

    float s0 = SDFSphere(pos, fSpherePos, fSphereRadius);
    float s1 = SDFSphere(pos, fSphereCutoutPos, fSphereRadius * 0.8);
    float s = SDFSmoothSubtract(s1, s0, 0.2);

    float sphereDistance = SDFSphere(pos, MAIN_SPHERE_POSITION, MAIN_SPHERE_RADIUS);

    float d = SDFSmoothUnion(s, sphereDistance, 1.0);
    d += cos(posRot.x * posRot.y * posRot.z) * 0.02; // ridges

    holeMask = SDFIntersect(s0 + 0.2, s1);

    return d;
}

float RayMarch(vec3 startPosition, vec3 rayDirection, out vec3 position, out vec3 normal, out float holeMask, out float geoMask)
{
    float d;
    position = startPosition;

    for (int i = 0; i < RAYMARCH_ITERATIONS; i++)
    {
        d = DistanceCheck(position, holeMask);
        // if (d <= 0.0001) { break; } // breaking loop causes artifacts when using ddx ddy
        position += rayDirection * d;
    }

    vec3 nX = dFdx(position);
    vec3 nY = dFdy(position);
    normal = normalize(cross(nY, nX));

    //holeMask = Clamp01(-holeMask * 8.0);
    holeMask = -holeMask;
    geoMask = Clamp01(1.0 - d);

    return d;
}

vec3 CalculateLightBeamColor(int cylinderIndex)
{
    return CYLINDER_COLORS[cylinderIndex] * 3.0;
}

vec4 CalculateLightBeam(vec3 startPosition, float depthSqr, vec3 cylinderPos, vec3 cylinderDir, vec3 hitNear, vec3 hitFar, float mouseInfluenceWeight, int cylinderIndex)
{
    float mouseInfluence = mouseInfluenceWeight * 0.5 + 0.5;

    float depthMask = LengthSquared(hitNear - startPosition);
    depthMask = Clamp01((depthSqr - depthMask) * 0.1);

    float lengthFalloff = dot(hitFar - cylinderPos, cylinderDir);

    float fade = 1.0 - Clamp01(lengthFalloff / (LIGHT_BEAM_FALLOFF_DISTANCE * (0.5 + mouseInfluence)));
    fade *= fade;
    fade *= fade;

    float density = LengthSquared(hitNear - hitFar);
    float density01 = Clamp01(density);

    vec3 color = CalculateLightBeamColor(cylinderIndex);

    // start particles

    vec3 delta = hitFar - cylinderPos;
    vec3 V = delta - dot(delta, cylinderDir) * cylinderDir;
    vec3 U = cross(cylinderDir, UP);
    vec3 W = cross(cylinderDir, U);
    float theta = atan(dot(V, W), dot(V, U));

    const float particlesX = 200.0;
    const float particlesXInv = 1.0 / particlesX;

    const float particlesY = 4.0;
    const float particlesYInv = 1.0 / particlesY;

    float xIndex = (theta + PI) / TAU;
    xIndex = xIndex * particlesX;
    float xCoord = fract(xIndex);
    xIndex = floor(xIndex) * particlesXInv;

    float randomYOffset = Random(xIndex);

    float yIndex = 1.0 - Clamp01(lengthFalloff * LIGHT_BEAM_FALLOFF_DISTANCE_INV);
    yIndex *= yIndex;
    yIndex *= yIndex;
    yIndex = (yIndex + randomYOffset + uTime * PARTICLE_SPEED) * particlesY;
    float yCoord = fract(yIndex);
    yIndex = floor(yIndex) * particlesYInv;

    vec2 cell = vec2(xIndex, yIndex);
    float cellRandom = Random(cell);
    float particleMultiplier = Clamp01((mouseInfluence * mouseInfluence - cellRandom * 8.0) * 3.0);

    // edge fade x coord
    float particleFade = 1.0 - 2.0 * xCoord;
    particleFade = 1.0 - particleFade * particleFade;
    particleFade *= particleFade;

    // each particle fades along its y coord
    particleFade *= (1.0 - yCoord);

    // fade when cylinder normal is near perpendicular to view direction
    //particleFade *= density;

    // fade in from spawn point
    particleFade *= Clamp01(lengthFalloff);

    float particles = particleMultiplier * particleFade * density * 2.0;

    vec3 particleColor = mix(vec3(1.0, 1.0, 0.4), vec3(1.0, 0.4, 1.0), fract(cellRandom * 36373.33)) * color * particles;

    // end particles

    float brightness = density * mouseInfluence;
    //brightness += particles;

    color *= brightness;
    color += particleColor;

    float alpha = fade * depthMask;

    return vec4(color * alpha, alpha);
}

vec4 CalculateLightBeams(vec3 startPosition, vec3 rayMarchPosition, vec3 viewDirection)
{
    float depthSqr = LengthSquared(rayMarchPosition - startPosition);

    vec4 o = vec4(0.0);

    for (int i = 0; i < F_SPHERE_COUNT; i++)
    {
        vec3 cylinderPos = MAIN_SPHERE_POSITION + uFSphereDirections[i].xyz * MAIN_SPHERE_RADIUS;
        vec3 cylinderDir = uFSphereDirections[i].xyz;
        float mouseInfluenceWeight = uFSphereDirections[i].w;

        float tNear, tFar;
        bool valid = RayInfiniteCylinderIntersect(startPosition, viewDirection, cylinderPos, cylinderDir, 0.5 + mouseInfluenceWeight * MOUSE_INFLUENCE_RADIUS_MULTIPLIER, tNear, tFar);
        vec3 hitNear = startPosition + viewDirection * tNear;
        bool capCheck = dot(hitNear - cylinderPos, cylinderDir) >= 0.0;
        valid = valid && capCheck;

        if (valid)
        {
            vec3 hitFar = startPosition + viewDirection * tFar;
            o += CalculateLightBeam(startPosition, depthSqr, cylinderPos, cylinderDir, hitNear, hitFar, mouseInfluenceWeight, i);
        }
    }

    o.xyz = 1.0 - 1.0 / (o.xyz + 1.0);
    o.xyz *= 1.0;

    return o;
}

vec3 Lighting(vec3 position, vec3 normal)
{
    vec3 accumulatedDiffuse = vec3(0.0);

    // directional light

    float lightStrength = 0.2;
    vec3 lightColor = vec3(0.1, 0.4, 0.8);
    vec3 L = UP;

    float diffuse = dot(L, normal);
    diffuse = Clamp01(diffuse);
    diffuse = diffuse * diffuse * (3.0 - 2.0 * diffuse);
    diffuse *= lightStrength;

    accumulatedDiffuse += diffuse * lightColor;

    // point lights

    lightStrength = 2000.0;
    lightColor = vec3(0.5, 0.2, 0.8);
    vec3 lightPos = vec3(8.0, 8.0, 10.0);

    vec3 delta = lightPos - position;
    float DSqr = LengthSquared(delta);
    float D = sqrt(DSqr);
    L = delta / D;
    float extinction = 1.0 / (D + 1.0);
    extinction *= extinction;

    diffuse = dot(L, normal);
    diffuse = Clamp01(diffuse);
    diffuse = diffuse * diffuse * (3.0 - 2.0 * diffuse);
    diffuse *= extinction * lightStrength;

    accumulatedDiffuse += diffuse * lightColor;

    lightStrength = 20.0;
    lightColor = vec3(1.0, 0.2, 0.1);
    lightPos = vec3(-10.0, -6.0, -1.0);

    delta = lightPos - position;
    DSqr = LengthSquared(delta);
    D = sqrt(DSqr);
    L = delta / D;
    extinction = 1.0 / (D + 1.0);
    extinction *= extinction;

    diffuse = dot(L, normal);
    diffuse = Clamp01(diffuse);
    diffuse = diffuse * diffuse * (3.0 - 2.0 * diffuse);
    diffuse *= extinction * lightStrength;

    accumulatedDiffuse += diffuse * lightColor;

    // beam lights

    vec3 posDelta = position - MAIN_SPHERE_POSITION;
    int fSphereIndex = 0;
    float closestDir = dot(posDelta, uFSphereDirections[fSphereIndex].xyz);

    // get closest matching cylinder direction
    for (int i = 1; i < F_SPHERE_COUNT; i++)
    {
        float dirCheck = dot(posDelta, uFSphereDirections[i].xyz);
        if (dirCheck > closestDir)
        {
            closestDir = dirCheck;
            fSphereIndex = i;
        }
    }

    {
        lightStrength = uFSphereDirections[fSphereIndex].w * 2.0 + 3.0;
        lightColor = CalculateLightBeamColor(fSphereIndex);
        lightPos = MAIN_SPHERE_POSITION + uFSphereDirections[fSphereIndex].xyz * MAIN_SPHERE_RADIUS * 1.5;

        delta = lightPos - position;
        DSqr = LengthSquared(delta);
        D = sqrt(DSqr);
        L = delta / D;
        extinction = 1.0 - Clamp01(D * (0.4 - uFSphereDirections[fSphereIndex].w * 0.1));
        extinction *= extinction;

        diffuse = dot(L, normal);
        diffuse = diffuse * 0.5 + 0.5;
        diffuse = diffuse * diffuse * (3.0 - 2.0 * diffuse);
        diffuse *= lightStrength * extinction;

        accumulatedDiffuse += diffuse * lightColor;
    }

    return accumulatedDiffuse;
}

// TODO : should be done CPU side and passed in as buffer or uniforms
void CalculateMouseInfluenceWeights(Camera camera, out float mouseInfluenceWeights[F_SPHERE_COUNT])
{
    float aspect = uScreenSize.x / uScreenSize.y;
    vec2 mousePos01 = uMousePosition / uScreenSize;
    vec2 mousePosNDC = vec2(mousePos01.x * 2.0 - 1.0, mousePos01.y * -2.0 + 1.0);
    vec2 mousePosNDCAspect = vec2(mousePosNDC.x * aspect, mousePosNDC.y);
    vec3 mouseP = CalculatePositionOnNearClipPlane(mousePosNDCAspect, camera);
    vec3 mouseV = normalize(mouseP);
    mouseP += camera.position;

    for (int i = 0; i < F_SPHERE_COUNT; i++)
    {
        vec3 p = uFSphereDirections[i].xyz * MAIN_SPHERE_RADIUS + MAIN_SPHERE_POSITION;
        mouseInfluenceWeights[i] = LengthSquared(ClosestPointOnLineFromPoint(mouseP, mouseV, p) - p);
        mouseInfluenceWeights[i] = 1.0 / (mouseInfluenceWeights[i] + 1.0);
        float t = 1.0 - Clamp01(-dot(uFSphereDirections[i].xyz, GetCameraForward(camera)));
        mouseInfluenceWeights[i] *= 1.0 - t * t;
    }
}

void GetMouseInfluenceWeights(out float mouseInfluenceWeights[F_SPHERE_COUNT])
{
    for (int i = 0; i < F_SPHERE_COUNT; i++)
    {
        mouseInfluenceWeights[i] = uFSphereDirections[i].w;
    }
}

void main()
{
    float aspect = uScreenSize.x / uScreenSize.y;
    float dither = InterleavedGradientNoise(vec2(gl_FragCoord.x, gl_FragCoord.y));
    
    vec3 camPos = vec3(0.0, 0.0, -CAMERA_DISTANCE);
    camPos = vec3(sin(uTime * 0.0001) * 12.0, 0.0, cos(uTime * 0.0001) * 12.0);
    camPos = uCameraPosition;
    //camPos.z += (sin(uTime * 0.001) + 1.0) * CAMERA_DISTANCE * 0.5;

    // Camera camera;
    // InitializeCamera(0.2, 100.0, CAMERA_FOV, aspect, camPos, MAIN_SPHERE_POSITION, camera);

    // CoordData coordData;
    // InitializeCoordData(vec2(gl_FragCoord.x, gl_FragCoord.y), uScreenSize, coordData);

    vec2 pos01 = vec2(gl_FragCoord.x / uScreenSize.x, gl_FragCoord.y / uScreenSize.y);
    vec2 posNDC = vec2(pos01.x * 2.0 - 1.0, pos01.y * 2.0 - 1.0);
    vec2 posNDCAspect = vec2(posNDC.x * aspect, posNDC.y);
    vec3 nearClipPos = TransformToViewSpace(uInvProjMatrix, uInvViewMatrix, posNDC);
    nearClipPos.z = -nearClipPos.z;
    vec3 viewDirection = normalize(nearClipPos);
    nearClipPos += camPos;

    float holeMask, geoMask;
    vec3 position, normal;
    float d = RayMarch(nearClipPos, viewDirection, position, normal, holeMask, geoMask);
    
    vec4 lightBeams = CalculateLightBeams(nearClipPos, position, viewDirection);
    //lightBeams.xyz *= 0.8 + dither * 0.2 * (1.0 - lightBeams.xyz);
    //lightBeams.xyz *= 1.0 - (dither + 1.0) * (1.0 - lightBeams.w * lightBeams.w * (3.0 - 2.0 * lightBeams.w)) * 0.1;
    float lightBeamDither = max(1.0 - 2.0 * lightBeams.w * lightBeams.w, 0.0);
    lightBeamDither *= lightBeamDither * 0.3;
    lightBeamDither = 1.0 - lightBeamDither * dither;
    lightBeams.xyz *= lightBeamDither;

    float cameraDistanceMask = length(camPos) - MAIN_SPHERE_RADIUS;
    holeMask = Clamp01(holeMask * (1.0 - Clamp01(cameraDistanceMask * CAMERA_DISTANCE_INV)) * 8.0);
    float alpha = (1.0 - holeMask) * Clamp01(cameraDistanceMask);

    vec3 lighting = Lighting(position, normal);
    lighting = (lighting + (dither - 0.5) * 0.02) * geoMask * alpha;
    vec3 color = lighting + lightBeams.xyz;

    //fragColor = vec4(r, g, b, 1.0);
    //fragColor = vec4(1.0 - Clamp01(d), 0.1, 0.1, 1.0);
    //fragColor = vec4(1.0 / (length(position) + 1.0) * 4.0, 0.0, 0.0, 1.0);
    //fragColor = vec4(1.0 - d, 0.0, 0.0, 1.0);
    //fragColor = vec4(N.x, N.y, N.z, 1.0);
    fragColor = vec4(color * alpha, alpha);
    //fragColor = vec4(dither, 0.0, 0.0, 1.0);
    //fragColor = vec4(holeMask, shade, 0.0, 1.0);
    //fragColor = vec4(1.0 / (length(position) + 1.0) * 4.0 * a, 0.0, 0.0, a);
    //fragColor = vec4(position.x, position.y, position.z, 1.0);
    //fragColor = vec4(camera.nearClipPos.x, camera.nearClipPos.y, camera.nearClipPos.z, 1.0);
    //fragColor = vec4(LengthSquared(hitNear - hitFar) * 0.05 * (tt ? 1.0 : 0.0), 0.0, 0.0, 1.0);
    //fragColor = vec4(vec3(lightBeams.w), 1.0);
    //fragColor = vec4(vec3(holeMask), 1.0);
    //fragColor = vec4(vec3(lightBeamDither), 1.0);
    //fragColor = vec4(nearClipPos, 1.0);
    //fragColor = vec4(position, 1.0);
    fragColor = vec4(viewDirection * (1.0 - geoMask), 1.0);
}