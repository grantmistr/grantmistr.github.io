#version 300 es

layout(location = 0) in int inVertexID;

uniform float uTime;
uniform vec2 uScreenSize;

out vec3 vColor;

const vec2 verts[3] = vec2[3] (vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
const vec3 colors[3] = vec3[] (vec3(0.0, 0.2, 1.0), vec3(1.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0));

void main()
{
    vColor = colors[inVertexID];
    vec2 posCS = verts[inVertexID];
    gl_Position = vec4(posCS.x, posCS.y, 0.0, 1.0);
}