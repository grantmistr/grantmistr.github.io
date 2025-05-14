#version 300 es

layout(location = 0) in int inVertexID;

uniform float uTime;
uniform vec2 uScreenSize;

const vec2 verts[3] = vec2[3] (vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));

void main()
{
    vec2 posCS = verts[inVertexID];
    gl_Position = vec4(posCS.x, posCS.y, 0.0, 1.0);
}