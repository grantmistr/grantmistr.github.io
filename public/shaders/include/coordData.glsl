#ifndef COORD_DATA
#define COORD_DATA

struct CoordData
{
    float aspectRatio;
    vec2 screenSize;
    vec2 positionPixel;
    vec2 pos01;
    vec2 posNDC;
    vec2 posNDCAspect;
};

void InitializeCoordData(vec2 positionPixel, vec2 screenSize, inout CoordData coordData)
{
    coordData.aspectRatio = screenSize.x / screenSize.y;
    coordData.screenSize = screenSize;
    coordData.positionPixel = positionPixel;
    coordData.pos01 = vec2(positionPixel.x / screenSize.x, positionPixel.y / screenSize.y);
    coordData.posNDC = vec2(coordData.pos01.x * 2.0 - 1.0, coordData.pos01.y * 2.0 - 1.0);
    coordData.posNDCAspect = vec2(coordData.posNDC.x * coordData.aspectRatio, coordData.posNDC.y);
}

#endif // COORD_DATA