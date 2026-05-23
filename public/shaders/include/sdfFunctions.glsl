#ifndef SDF_FUNCTIONS
#define SDF_FUNCTIONS

float SDFSubtract(float a, float b)
{
    return max(-a, b);
}

float SDFIntersect(float a, float b)
{
    return max(a, b);
}

float SDFSmoothUnion(float a, float b, float k)
{
    float h = max(k - abs(a - b), 0.0);
    return min(a, b) - h * h * 0.25 / k;
}

float SDFSmoothSubtract(float a, float b, float k)
{
    return -SDFSmoothUnion(a, -b, k);
}

float SDFSmoothIntersect(float a, float b, float k)
{
    return -SDFSmoothUnion(-a, -b, k);
}

float SDFCapsule(vec3 pos, vec3 capsulePos, vec3 dir, float len, float radius)
{
    vec3 A = dir * len;
    vec3 B = pos - capsulePos;

    float m = Clamp01(dot(B, A) / dot(A, A));
    vec3 BA = m * A;

    return length(B - BA) - radius;
}

float SDFSphere(vec3 pos, vec3 spherePos, float radius)
{
    return length(pos - spherePos) - radius;
}

#endif // SDF_FUNCTIONS