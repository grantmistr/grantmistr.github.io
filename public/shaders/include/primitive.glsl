#ifndef PRIMITIVE_FUNCTIONS
#define PRIMITIVE_FUNCTIONS

vec3 ClosestPointOnLineFromPoint(vec3 linePoint, vec3 lineDirection, vec3 point)
{
    return linePoint + lineDirection * dot(lineDirection, point - linePoint);
}

bool RayPlaneIntersect(vec3 rayOrigin, vec3 rayDirection, vec3 planePoint, vec3 planeNormal, out vec3 hitPos)
{
    vec3 delta = planePoint - rayOrigin;

    float denom = dot(rayDirection, planeNormal);
    float t = dot(delta, planeNormal) / denom;

    hitPos = rayOrigin + rayDirection * t;
    
    return t >= 0.0 && (abs(denom) >= EPSILON);
}

bool RayDiscIntersect(vec3 rayOrigin, vec3 rayDirection, vec3 discPosition, vec3 discNormal, float discRadius, out vec3 hitPos)
{
    vec3 delta = discPosition - rayOrigin;

    float denom = dot(rayDirection, discNormal);
    float t = dot(delta, discNormal) / denom;
    hitPos = rayOrigin + rayDirection * t;

    vec3 hitPosDelta = hitPos - discPosition;
    bool radiusTest = dot(hitPosDelta, hitPosDelta) <= (discRadius * discRadius);

    return radiusTest && (abs(denom) >= EPSILON);
}

bool RayInfiniteCylinderIntersect(vec3 rayOrigin, vec3 rayDirection, vec3 cylinderOrigin, vec3 cylinderDirection, float cylinderRadius, out vec3 hitNear, out vec3 hitFar)
{
    vec3 delta = rayOrigin - cylinderOrigin;

    vec3 rDcD = rayDirection - dot(rayDirection, cylinderDirection) * cylinderDirection;
    vec3 rPcD = delta - dot(delta, cylinderDirection) * cylinderDirection;

    float a = dot(rDcD, rDcD);
    float b = 2.0 * dot(rDcD, rPcD);
    float c = dot(rPcD, rPcD) - cylinderRadius * cylinderRadius;

    float disc = b * b - 4.0 * a * c;
    float sqrtDisc = sqrt(abs(disc));

    float t0 = (-b - sqrtDisc) / (2.0 * a);
    float t1 = (-b + sqrtDisc) / (2.0 * a);

    bool nearTest = t0 < t1;
    float near = nearTest ? t0 : t1;
    float far = nearTest ? t1 : t0;

    near = max(near, 0.0);

    hitNear = rayOrigin + rayDirection * near;
    hitFar = rayOrigin + rayDirection * far;

    return disc >= 0.0 && far >= 0.0;
}

bool RayInfiniteCylinderIntersect(vec3 rayOrigin, vec3 rayDirection, vec3 cylinderOrigin, vec3 cylinderDirection, float cylinderRadius, out float tNear, out float tFar)
{
    vec3 delta = rayOrigin - cylinderOrigin;

    vec3 rDcD = rayDirection - dot(rayDirection, cylinderDirection) * cylinderDirection;
    vec3 rPcD = delta - dot(delta, cylinderDirection) * cylinderDirection;

    float a = dot(rDcD, rDcD);
    float b = 2.0 * dot(rDcD, rPcD);
    float c = dot(rPcD, rPcD) - cylinderRadius * cylinderRadius;

    float disc = b * b - 4.0 * a * c;
    float sqrtDisc = sqrt(abs(disc));

    float t0 = (-b - sqrtDisc) / (2.0 * a);
    float t1 = (-b + sqrtDisc) / (2.0 * a);

    bool nearTest = t0 < t1;
    tNear = nearTest ? t0 : t1;
    tFar = nearTest ? t1 : t0;

    tNear = max(tNear, 0.0);

    return disc >= 0.0 && tFar >= 0.0;
}

#endif // PRIMITIVE_FUNCTIONS