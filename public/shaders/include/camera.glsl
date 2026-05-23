#ifndef CAMERA_INCLUDE
#define CAMERA_INCLUDE

struct Camera
{
    float near;
    float far;
    float FOV;
    vec3 position;
    vec3 target;
    mat3 view;
    mat3 invView;
    mat4 proj;
    mat4 invProj;
};

vec3 GetCameraRight(Camera camera)
{
    return camera.view[0];
}

vec3 GetCameraUp(Camera camera)
{
    return camera.view[1];
}

vec3 GetCameraForward(Camera camera)
{
    return camera.view[2];
}

vec4 TransformByProjectionMatrix(vec4 v, Camera camera)
{
    float x = camera.proj[0][0] * v[0];
    float y = camera.proj[1][1] * v[1];
    float z = camera.proj[2][2] * v[2] + camera.proj[2][3] * v[3];
    float w = camera.proj[3][2] * v[2];
    
    return vec4(x, y, z, w);
}

vec4 TransformByInverseProjectionMatrix(vec4 v, Camera camera)
{
    float x = camera.invProj[0][0] * v[0];
    float y = camera.invProj[1][1] * v[1];
    float z = camera.invProj[2][3] * v[3];
    float w = camera.invProj[3][2] * v[2] + camera.invProj[3][3] * v[3];
    
    return vec4(x, y, z, w);
}

void UpdateCamera(inout Camera camera)
{
    vec3 f = normalize(camera.target - camera.position);
    vec3 r = normalize(cross(UP, f));
    vec3 u = normalize(cross(f, r));

    camera.view = mat3(r, u, f);
    camera.invView = transpose(camera.view);
}

void CalculateProjectionMatrix(float aspect, inout Camera camera)
{
    float f = 1.0 / tan(camera.FOV * 0.5);
    float nMinusF = camera.near - camera.far;
    float nPlusF = camera.near + camera.far;
    float twoNF = 2.0 * camera.near * camera.far;

    camera.proj = mat4(
        f / aspect, 0.0,        0.0,                0.0,
        0.0,        f,          0.0,                0.0,
        0.0,        0.0,        nPlusF / nMinusF,   twoNF / nMinusF,
        0.0,        0.0,        1.0,                0.0
    );

    camera.invProj = mat4(
        aspect / f, 0.0,        0.0,                0.0,
        0.0,        1.0 / f,    0.0,                0.0,
        0.0,        0.0,        0.0,                1.0,
        0.0,        0.0,        nMinusF / twoNF,    nPlusF / twoNF
    );
}

void UpdateProjectionMatrix(float aspect, inout Camera camera)
{
    CalculateProjectionMatrix(aspect, camera);
}

void InitializeCamera(float near, float far, float FOV, float aspect, vec3 position, vec3 target, inout Camera camera)
{
    camera.near = near;
    camera.far = far;
    camera.FOV = FOV;
    camera.position = position;
    camera.target = target;

    UpdateCamera(camera);
    UpdateProjectionMatrix(aspect, camera);
}

vec3 CalculatePositionOnNearClipPlane(vec2 positionNDC, Camera camera)
{
    vec4 t = TransformByInverseProjectionMatrix(vec4(positionNDC.x, positionNDC.y, -1.0, 1.0), camera);
    vec3 v = t.xyz / t.w;
    v = camera.invView * v;
    v = v + camera.position;
    return v;
    //return (camera.forward * camera.near) + (camera.right * positionNDCAspect.x * camera.FOV) + (camera.up * positionNDCAspect.y * camera.FOV);
}

vec3 TransformToViewSpace(vec2 positionNDC, Camera camera)
{
    vec4 t = TransformByInverseProjectionMatrix(vec4(positionNDC.x, positionNDC.y, -1.0, 1.0), camera);
    vec3 v = t.xyz / t.w;
    v = camera.invView * v;
    return v;
}

#endif // CAMERA_INCLUDE