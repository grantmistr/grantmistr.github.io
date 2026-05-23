#ifndef CYLINDER_HIT_DATA
#define CYLINDER_HIT_DATA

struct CylinderHitData
{
    bool valid;
    float tNear;
    float tFar;
    vec3 cylinderPos;
    vec3 cylinderDir;
};

#endif // CYLINDER_HIT_DATA