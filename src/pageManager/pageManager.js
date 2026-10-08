import { PageInfo } from "../pages/pageInfo.js";
import { Page0Info } from "../pages/page0/page0.js";
import { GLCTX } from "../webGL/webGL.js";
import { Camera } from "../webGL/camera.js";
import { SceneConstants } from "../webGL/constants.js";
import { LoadShaderProgram } from "../webGL/shaderLoader.js";
import { Shader3ProgramInfo } from "../webGL/program/shader3ProgramInfo.js";
import { F_SPHERE_COLORS, F_SPHERE_COUNT, F_SPHERE_DIRECTIONS } from "../common/fibonacciSphere.js";
import { ClosestPointOnLineFromPoint } from "../common/primitive.js";
import * as Vec2 from "../common/vector2.js";
import * as Vec3 from "../common/vector3.js";
import * as Mat3 from "../common/matrix3.js";
export class Uniforms {
    time = 0.0;
    deltaTime = 0.0;
    mouseClickTime = 0.0;
    mouseDown = false;
    mouseMoved = false;
    screenSize = [0, 0];
    aspectRatio = 1.0;
    mousePosition = [0, 0];
    mouseClickPosition = [0, 0];
    mouseDelta = [0, 0];
    Update(timeSinceLoad) {
        this.deltaTime = timeSinceLoad - this.time;
        this.time = timeSinceLoad;
    }
    PostUpdate() {
        this.mouseMoved = false;
        this.mouseDelta = [0, 0];
    }
}
const PAGE_COUNT = 9;
const PageIndices = {
    '_projects': 0,
    '_3d': 1,
    '_digital2d': 2,
    '_logodesign': 3,
    '_p4': 4,
    '_p5': 5,
    '_p6': 6,
    '_contactinfo': 7,
    '_home': 8
};
const PageNames = {
    [PageIndices._projects]: 'projects',
    [PageIndices._3d]: '3d',
    [PageIndices._digital2d]: 'digital2d',
    [PageIndices._logodesign]: 'logodesign',
    [PageIndices._p4]: 'p4',
    [PageIndices._p5]: 'p5',
    [PageIndices._p6]: 'p6',
    [PageIndices._contactinfo]: 'contactinfo',
    [PageIndices._home]: 'home'
};
const NiceNames = {
    [PageIndices._projects]: 'Projects',
    [PageIndices._3d]: '3D',
    [PageIndices._digital2d]: 'Digital 2D',
    [PageIndices._logodesign]: 'Logo Design',
    [PageIndices._p4]: 'Page 4',
    [PageIndices._p5]: 'Page 5',
    [PageIndices._p6]: 'Page 6',
    [PageIndices._contactinfo]: 'Contact Info',
    [PageIndices._home]: 'Home'
};
function GetLocationIndex(locationHash) {
    const s = locationHash.slice(1); // remove #
    switch (s) {
        case PageNames[0]:
            return 0;
        case PageNames[1]:
            return 1;
        case PageNames[2]:
            return 2;
        case PageNames[3]:
            return 3;
        case PageNames[4]:
            return 4;
        case PageNames[5]:
            return 5;
        case PageNames[6]:
            return 6;
        case PageNames[7]:
            return 7;
        case PageNames[8]:
            return 8;
        default:
            return PageIndices._home;
    }
}
class PageManager {
    TARGET_FPS = 100.0;
    TARGET_MS = 1000.0 / this.TARGET_FPS;
    constants = {
        MAIN_SPHERE_POSITION: [0.0, 0.0, 0.0],
        MAIN_SPHERE_RADIUS: 4.0,
        DEFAULT_SPHERE_ROTATION_DELTA: [0.0005, 0.0003],
        CAMERA_DISTANCE: 12.0,
        DEFAULT_CAMERA_POSITION: [0.0, 0.0, -12.0],
        CAMERA_ZOOM_TIME: 2000.0,
        CAMERA_ACCELERATION: 0.01,
        PAGE_INFO_FADE_SPEED: 0.001
    };
    gl = new GLCTX();
    uniforms = new Uniforms();
    programInfo = null;
    pageInfos = Array(PAGE_COUNT);
    pageInfosData = Array(PAGE_COUNT); // increasing, opacity
    pageInfosNeedUpdate = false;
    pageIndices = [PageIndices._home, PageIndices._home];
    pageNeedsUpdate = false;
    webGLCanvasWrapper = document.getElementById('webGLCanvasWrapper');
    camera = new Camera(SceneConstants.CAMERA_NEAR, SceneConstants.CAMERA_FAR, SceneConstants.CAMERA_FOV, window.innerWidth / window.innerHeight, [...this.constants.DEFAULT_CAMERA_POSITION], [...this.constants.MAIN_SPHERE_POSITION]);
    mouseDelta = [0.0, 0.0];
    sphereRotationDelta = [0.0, 0.0];
    rotationMatrix = Mat3.IDENTITY;
    cssPerspective = 1000.0;
    fSphereDir = Array(F_SPHERE_COUNT);
    fSphereElements = Array(F_SPHERE_COUNT);
    fSphereElementButtons = Array(F_SPHERE_COUNT);
    fSphereElementText = Array(F_SPHERE_COUNT);
    fSphereElementsContainer = document.createElement('div');
    fSphereElementButtonsContainer = document.createElement('div');
    fSphereElementTextContainer = document.createElement('div');
    fSphereElementBaseSize = [1.0, 1.0];
    fSphereElementTargetScale = [1.0, 1.0];
    clickButton = false;
    clickTargetIndex = 0;
    clickPrevIndex = 0;
    clickTimeSnapshot = 0.0;
    clickRotationAxis = [0.0, 1.0, 0.0];
    clickRotationTheta = 0.0;
    clickMatrixSnapshot = Mat3.IDENTITY;
    clickZOffsetSnapshot = this.constants.DEFAULT_CAMERA_POSITION[2];
    currentFrame = 0;
    constructor() {
    }
    Initialize() {
        this.uniforms.screenSize = [window.innerWidth, window.innerHeight];
        this.uniforms.aspectRatio = window.innerWidth / window.innerHeight;
        this.camera.UpdateProjectionMatrix(this.uniforms.aspectRatio);
        this.camera.Update();
        this.gl.Initialize();
        this.InitFSphereDirArray();
        this.InitPageInfos();
        this.InitHTMLElements(this.uniforms, this.camera);
        this.LoadShaderProgram();
        window.onload = (e) => {
            this.SetInitialPageState(location.hash);
        };
        window.onhashchange = (e) => {
            this.UpdatePageIndices(location.hash, e.oldURL);
            // this.UpdatePageState(location.hash, e.oldURL);
        };
        window.onresize = (e) => {
            this.uniforms.screenSize = [window.innerWidth, window.innerHeight];
            this.uniforms.aspectRatio = window.innerWidth / window.innerHeight;
            this.camera.UpdateProjectionMatrix(this.uniforms.aspectRatio);
            this.UpdateCSSPerspective(this.uniforms, this.camera);
            this.UpdateFSphereElementSize();
            this.gl.OnResize();
        };
        window.onmousemove = (e) => {
            const rect = this.gl.canvas.getBoundingClientRect();
            this.uniforms.mouseMoved = true;
            this.uniforms.mousePosition = [e.clientX - rect.left, e.clientY - rect.top];
            this.uniforms.mouseDelta = [e.movementX, -e.movementY];
            this.mouseDelta = this.uniforms.mouseDelta;
        };
        window.ontouchmove = (e) => {
            const rect = this.gl.canvas.getBoundingClientRect();
            this.uniforms.mouseMoved = true;
            this.uniforms.mousePosition = [e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top];
            this.uniforms.mouseDelta = [this.uniforms.mousePosition[0] - this.uniforms.mouseClickPosition[0], -this.uniforms.mousePosition[1] + this.uniforms.mouseClickPosition[1]];
            this.mouseDelta = this.uniforms.mouseDelta;
        };
        window.onmousedown = (e) => {
            const rect = this.gl.canvas.getBoundingClientRect();
            this.uniforms.mouseDown = true;
            this.uniforms.mouseClickPosition = [e.clientX - rect.left, e.clientY - rect.top];
            this.uniforms.mouseClickTime = this.uniforms.time;
            this.uniforms.mouseDelta = [0.0, 0.0];
        };
        window.ontouchstart = (e) => {
            const rect = this.gl.canvas.getBoundingClientRect();
            this.uniforms.mouseDown = true;
            this.uniforms.mouseClickPosition = [e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top];
            this.uniforms.mouseClickTime = this.uniforms.time;
            this.uniforms.mouseDelta = [0.0, 0.0];
        };
        window.onmouseup = (e) => {
            this.uniforms.mouseDown = false;
        };
        window.ontouchend = (e) => {
            this.uniforms.mouseDown = false;
        };
        StartRender();
    }
    async LoadShaderProgram() {
        this.programInfo = await LoadShaderProgram('./public/shaders/shader3/vertexProgram.vert', './public/shaders/shader3/fragmentProgram.frag', this.gl.gl, Shader3ProgramInfo);
    }
    SetInitialPageState(locationHash) {
        const i = GetLocationIndex(locationHash);
        this.clickButton = i !== PageIndices._home;
        this.clickTargetIndex = i;
        this.clickTimeSnapshot = -999999.0;
        this.pageInfos[i].wrapper.style.display = '';
        this.pageInfos[i].wrapper.style.opacity = '1.0';
        this.pageInfosData[i] = [true, 1.0];
        if (this.clickButton) {
            this.rotationMatrix = Mat3.RotationMatrixFromForward(Vec3.Negate(F_SPHERE_DIRECTIONS[i]));
            this.clickMatrixSnapshot = this.rotationMatrix;
            this.camera.position[2] = -this.constants.MAIN_SPHERE_RADIUS;
            this.webGLCanvasWrapper.style.pointerEvents = 'none';
            // this.fSphereElementsContainer.style.pointerEvents = 'none';
            this.fSphereElementTextContainer.style.pointerEvents = 'none';
            this.fSphereElementButtonsContainer.style.pointerEvents = 'none';
        }
        else {
            this.rotationMatrix = Mat3.IDENTITY;
            this.webGLCanvasWrapper.style.pointerEvents = 'auto';
            // this.fSphereElementsContainer.style.pointerEvents = 'auto';
            this.fSphereElementTextContainer.style.pointerEvents = 'auto';
            this.fSphereElementButtonsContainer.style.pointerEvents = 'auto';
        }
    }
    UpdatePageIndices(locationHash, oldURL) {
        const i = GetLocationIndex(locationHash);
        const prev_i = GetLocationIndex(oldURL.slice(oldURL.indexOf('#')));
        this.pageIndices = [i, prev_i];
        this.pageNeedsUpdate = true;
    }
    // private UpdatePageState(locationHash: string, oldURL: string): void
    // I split this function off from UpdatePageIndices because I was occasionally getting NaNs in my
    // matrices that get passed to the shader. My thought was that there was some sort of race condition
    // since the rotation matrix was getting updated from the event listener and the update loop. This
    // didn't fix the NaN issue, so idk, but I'm keeping it this way for the aforementioned reason.
    UpdatePageData() {
        if (!this.pageNeedsUpdate) {
            return;
        }
        this.pageNeedsUpdate = false;
        const i = this.pageIndices[0];
        const prev_i = this.pageIndices[1];
        this.clickButton = i !== PageIndices._home;
        this.clickTargetIndex = i;
        this.clickPrevIndex = prev_i;
        this.clickTimeSnapshot = this.uniforms.time;
        this.clickZOffsetSnapshot = this.camera.position[2];
        this.sphereRotationDelta = [0.0, 0.0];
        this.pageInfosData[i][0] = true;
        this.pageInfosData[prev_i][0] = false;
        this.pageInfos[i].wrapper.style.display = '';
        this.pageInfosNeedUpdate = true;
        if (this.clickButton) {
            this.webGLCanvasWrapper.style.pointerEvents = 'none';
            // this.fSphereElementsContainer.style.pointerEvents = 'none';
            this.fSphereElementTextContainer.style.pointerEvents = 'none';
            this.fSphereElementButtonsContainer.style.pointerEvents = 'none';
        }
        else // home page target
         {
            this.webGLCanvasWrapper.style.pointerEvents = 'auto';
            // this.fSphereElementsContainer.style.pointerEvents = 'auto';
            this.fSphereElementTextContainer.style.pointerEvents = 'auto';
            this.fSphereElementButtonsContainer.style.pointerEvents = 'auto';
            return;
        }
        const a = this.camera.forward();
        const b = [this.fSphereDir[i][0], this.fSphereDir[i][1], this.fSphereDir[i][2]];
        let c = Vec3.CrossProduct(a, b);
        if (Vec3.AllComponentZero(c)) {
            c = [...SceneConstants.UP];
        }
        else {
            c = Vec3.Normalize(c);
        }
        this.clickRotationAxis = c;
        this.clickRotationTheta = Math.acos(Vec3.Dot(a, b));
        this.clickMatrixSnapshot = this.rotationMatrix;
        console.log(b);
    }
    UpdatePageInfosDisplay(uniforms) {
        if (!this.pageInfosNeedUpdate) {
            return;
        }
        this.pageInfosNeedUpdate = false;
        this.pageInfosData.forEach((data, i) => {
            const increasing = data[0];
            let opacity = data[1];
            if (increasing) {
                if (opacity >= 1.0) {
                    return;
                }
                opacity += uniforms.deltaTime * this.constants.PAGE_INFO_FADE_SPEED;
                if (opacity > 1.0) {
                    opacity = 1.0;
                }
            }
            else {
                if (opacity <= 0.0) {
                    this.pageInfos[i].wrapper.style.display = 'none';
                    return;
                }
                opacity -= uniforms.deltaTime * this.constants.PAGE_INFO_FADE_SPEED;
                if (opacity < 0.0) {
                    opacity = 0.0;
                }
            }
            data[1] = opacity;
            this.pageInfos[i].wrapper.style.opacity = opacity.toString();
            this.pageInfosNeedUpdate = true;
        });
    }
    InitPageInfos() {
        this.pageInfos[PageIndices._projects] = new Page0Info('./src/pages/page0/page0.html');
        this.pageInfos[PageIndices._3d] = new PageInfo(null);
        this.pageInfos[PageIndices._digital2d] = new PageInfo(null);
        this.pageInfos[PageIndices._logodesign] = new PageInfo(null);
        this.pageInfos[PageIndices._p4] = new PageInfo(null);
        this.pageInfos[PageIndices._p5] = new PageInfo(null);
        this.pageInfos[PageIndices._p6] = new PageInfo(null);
        this.pageInfos[PageIndices._contactinfo] = new PageInfo(null);
        this.pageInfos[PageIndices._home] = new PageInfo(null);
        this.pageInfos.forEach((pageInfo, i) => {
            pageInfo.wrapper.className = 'pageInfo';
            pageInfo.wrapper.id = pageInfo.wrapper.className + i.toString();
            pageInfo.wrapper.style.display = 'none';
            pageInfo.wrapper.style.opacity = '0.0';
            pageInfo.wrapper.style.zIndex = '1';
            this.pageInfosData[i] = [false, 0.0];
        });
    }
    InitFSphereDirArray() {
        F_SPHERE_DIRECTIONS.forEach((dir, i) => {
            this.fSphereDir[i] = [dir[0], dir[1], dir[2], 0.0];
        });
    }
    InitHTMLElements(uniforms, camera) {
        this.UpdateCSSPerspective(uniforms, camera);
        this.UpdateFSphereElementSize();
        this.fSphereElementsContainer.id = "fSphereElementsContainer";
        document.body.appendChild(this.fSphereElementsContainer);
        this.fSphereElementButtonsContainer.id = "fSphereElementButtonsContainer";
        document.body.appendChild(this.fSphereElementButtonsContainer);
        this.fSphereElementTextContainer.id = "fSphereElementTextContainer";
        document.body.appendChild(this.fSphereElementTextContainer);
        F_SPHERE_DIRECTIONS.forEach((dir, i) => {
            const index = i.toString();
            const color = Vec3.MultiplyScalar(F_SPHERE_COLORS[i], 2.0);
            const element = document.createElement('div');
            element.className = 'fSphereElement';
            element.id = element.className + index;
            const elementBackground = document.createElement('div');
            elementBackground.className = element.className + 'Background';
            elementBackground.id = elementBackground.className + index;
            elementBackground.style.background = `rgb(${color[0] * 255.0}, ${color[1] * 255.0}, ${color[2] * 255.0})`;
            elementBackground.style.zIndex = '0';
            const button = document.createElement('button');
            button.className = element.className + 'Button';
            button.id = button.className + index;
            const text = document.createElement('div');
            text.className = element.className + 'Text';
            text.id = text.className + index;
            text.textContent = NiceNames[i];
            button.onclick = (e) => {
                location.hash = PageNames[i];
                // history.pushState({}, '', 'button' + i.toString());
            };
            button.onmouseover = (e) => {
                // console.log("hover " + index);
            };
            this.fSphereElementsContainer.appendChild(element);
            this.fSphereElementButtonsContainer.appendChild(button);
            this.fSphereElementTextContainer.appendChild(text);
            this.fSphereElements[i] = element;
            this.fSphereElementButtons[i] = button;
            this.fSphereElementText[i] = text;
            this.fSphereElements[i].appendChild(elementBackground);
            this.fSphereElements[i].appendChild(this.pageInfos[i].wrapper);
        });
        this.UpdateHTMLElements(uniforms, camera);
    }
    UpdateHTMLElements(uniforms, camera) {
        const camT = (Math.abs(camera.position[2]) - this.constants.CAMERA_DISTANCE) / -(this.constants.CAMERA_DISTANCE - this.constants.MAIN_SPHERE_RADIUS * 1.4);
        let t = camT * camT;
        t = t > 1.0 ? 1.0 : t;
        const scale = Vec2.Lerp([1.0, 1.0], this.fSphereElementTargetScale, t);
        const radius = this.constants.MAIN_SPHERE_RADIUS - camera.near * t * 2.0;
        const f = camera.forward();
        const r = camera.right();
        this.fSphereDir.forEach((dir, i) => {
            const d = [dir[0], dir[1], dir[2]];
            const FdotD = Vec3.Dot(f, d);
            const RdotD = Vec3.Dot(r, d);
            const mouseInfluence = dir[3];
            const worldPos = Vec3.MultiplyScalar(d, radius);
            const camRelativeWorldPos = Vec3.Subtract(worldPos, camera.position);
            const pos = camera.TransformByViewMatrix(camRelativeWorldPos);
            const v = camera.TransformByProjectionMatrix([pos[0], pos[1], pos[2], 1.0]);
            const p01 = [v[0] / v[3], v[1] / v[3], v[2] / v[3]];
            const p = [p01[0] * window.innerWidth * 0.5, p01[1] * window.innerHeight * -0.5, p01[2]];
            const zIndex = Math.floor((1.0 - p[2]) * 1000.0).toString();
            const disabled = FdotD < 0.2 || this.clickButton;
            const textOffsetMultiplier = 1.2 + mouseInfluence * (Math.abs(RdotD) * NiceNames[i].length * 0.08 + 0.1);
            const textOpacity = ((mouseInfluence * 0.85 + 0.15) * (1.0 - t)).toString();
            const textScale = 16.0 / (Vec3.LengthSquared(pos) + 1.0) + mouseInfluence * 0.1;
            let axis = Vec3.CrossProduct(f, d);
            if (Vec3.AllComponentZero(axis)) {
                axis = [...SceneConstants.UP];
            }
            const theta = Math.acos(FdotD) * (1.0 - mouseInfluence) * (1.0 - mouseInfluence) * 0.9;
            this.fSphereElements[i].style.transform = `translate(${p[0]}px, ${p[1]}px)`;
            this.fSphereElements[i].style.zIndex = zIndex;
            this.fSphereElements[i].children[0].style.transform = `scale(${scale[0]}, ${scale[1]})`;
            this.fSphereElementText[i].style.transform = `translate(${p[0] * textOffsetMultiplier}px, ${p[1] * textOffsetMultiplier}px) rotate3d(${axis[0]}, ${-axis[1]}, ${axis[2]}, ${theta}rad) scale(${textScale})`;
            this.fSphereElementText[i].style.opacity = textOpacity;
            this.fSphereElementButtons[i].style.transform = `translate(${p[0] * 1.1}px, ${p[1] * 1.1}px)`;
            this.fSphereElementButtons[i].style.zIndex = zIndex;
            this.fSphereElementButtons[i].disabled = disabled;
        });
    }
    UpdateCSSPerspective(uniforms, camera) {
        this.cssPerspective = uniforms.screenSize[1] / Math.tan(camera.FOV);
        this.fSphereElementTextContainer.style.setProperty('--css-perspective', (this.cssPerspective).toString() + 'px');
    }
    UpdateFSphereElementSize(size = window.innerHeight * 0.2) {
        this.fSphereElementBaseSize = [size, size];
        this.fSphereElementTargetScale = [(window.innerWidth + 8.0) / this.fSphereElementBaseSize[0], (window.innerHeight + 8.0) / this.fSphereElementBaseSize[1]];
        const elementSize = size.toString() + 'px';
        const buttonSize = (size * 0.6).toString() + 'px';
        this.fSphereElementsContainer.style.setProperty('--width', elementSize);
        this.fSphereElementsContainer.style.setProperty('--height', elementSize);
        this.fSphereElementButtonsContainer.style.setProperty('--width', buttonSize);
        this.fSphereElementButtonsContainer.style.setProperty('--height', buttonSize);
        this.fSphereElementButtonsContainer.style.setProperty('--border-radius', buttonSize);
        this.fSphereElementTextContainer.style.fontSize = elementSize;
    }
    CalculateMouseInfluenceWeights(uniforms, camera) {
        const mousePos01 = [uniforms.mousePosition[0] / uniforms.screenSize[0], uniforms.mousePosition[1] / uniforms.screenSize[1]];
        const mousePosNDC = [mousePos01[0] * 2.0 - 1.0, mousePos01[1] * -2.0 + 1.0, SceneConstants.NEAR_CLIP_VALUE];
        const nearClipPos = camera.TransformFromClipToCameraRelativeWorldSpace(mousePosNDC);
        const mouseV = Vec3.Normalize(nearClipPos);
        const mouseP = Vec3.Add(nearClipPos, camera.position);
        this.fSphereDir.forEach((dir) => {
            const d = [dir[0], dir[1], dir[2]];
            const p = Vec3.Add(Vec3.MultiplyScalar(d, this.constants.MAIN_SPHERE_RADIUS), this.constants.MAIN_SPHERE_POSITION);
            let weight = Vec3.LengthSquared(Vec3.Subtract(ClosestPointOnLineFromPoint(mouseP, mouseV, p), p));
            weight = 1.0 / (weight + 1.0);
            const t = 1.0 - Math.max(Vec3.Dot(d, camera.view[2]), 0.0);
            weight *= 1.0 - t * t;
            dir[3] = weight;
        });
        if (this.clickButton) {
            let t = (uniforms.time - this.clickTimeSnapshot) / 200.0;
            t = 2.0 * t - 1.0;
            t = t * t;
            t = t * 0.5 + 0.5;
            t = t > 1.0 ? 1.0 : t;
            t = t * t * (3.0 - 2.0 * t);
            this.fSphereDir[this.clickTargetIndex][3] *= t;
        }
    }
    CalculateSphereRotationDelta(uniforms, mouseDelta) {
        if (uniforms.mouseDown) {
            this.sphereRotationDelta = Vec2.MultiplyScalar(mouseDelta, 0.5);
        }
        else {
            const factor = Math.max(1.0 - Math.max(uniforms.deltaTime * 0.002, Number.EPSILON), 0.0);
            this.sphereRotationDelta = Vec2.MultiplyScalar(this.sphereRotationDelta, factor);
            this.sphereRotationDelta = Vec2.Add(this.sphereRotationDelta, Vec2.MultiplyScalar(this.constants.DEFAULT_SPHERE_ROTATION_DELTA, Math.min(uniforms.deltaTime, 33.333))); // clamp dT to ~30 fps
        }
    }
    CalculateRotationMatrixFromDelta(delta) {
        const a = [...SceneConstants.FORWARD];
        const b = [delta[0], delta[1], 0.0];
        const axis = Vec3.Normalize(Vec3.CrossProduct(a, b)); // this cross product shouldn't ever return a 0 length vector...
        const theta = Vec2.Length(delta) * -0.004;
        return Mat3.RotationMatrixFromAxisAndAngle(axis, theta);
    }
    UpdateRotationMatrix(uniforms, mouseDelta) {
        if (this.clickButton) {
            let t = (uniforms.time - this.clickTimeSnapshot) / (this.constants.CAMERA_ZOOM_TIME * 0.75);
            t = t < 0.0 ? 0.0 : t;
            t = t > 1.0 ? 1.0 : t;
            t = t * t * (3.0 - 2.0 * t);
            t = t * t * (3.0 - 2.0 * t);
            const m = Mat3.RotationMatrixFromAxisAndAngle(this.clickRotationAxis, this.clickRotationTheta * t);
            this.rotationMatrix = Mat3.MultiplyByMat3(m, this.clickMatrixSnapshot);
        }
        else {
            if (Math.abs(this.camera.position[2]) < (this.constants.MAIN_SPHERE_RADIUS + 1.0)) // prevent rotate sphere when cam really close
             {
                return;
            }
            this.CalculateSphereRotationDelta(uniforms, mouseDelta);
            if (this.sphereRotationDelta[0] !== 0.0 || this.sphereRotationDelta[1] !== 0.0) {
                const m = this.CalculateRotationMatrixFromDelta(this.sphereRotationDelta);
                this.rotationMatrix = Mat3.MultiplyByMat3(m, this.rotationMatrix);
            }
        }
        this.fSphereDir.forEach((dir, i) => {
            const d = Vec3.MultiplyByMat3(this.rotationMatrix, F_SPHERE_DIRECTIONS[i]);
            dir[0] = d[0];
            dir[1] = d[1];
            dir[2] = d[2];
        });
    }
    UpdateCameraPosition(uniforms) {
        let t = (uniforms.time - this.clickTimeSnapshot) / this.constants.CAMERA_ZOOM_TIME;
        if (t > 1.0) {
            return;
        }
        if (this.clickButton) {
            // zoom in only
            if (this.clickPrevIndex === PageIndices._home) {
                t = t * t;
                const z = (1.0 - t) * this.clickZOffsetSnapshot + t * -this.constants.MAIN_SPHERE_RADIUS;
                this.camera.position[2] = z;
            }
            // zoom out, then zoom back in
            else {
                const _t = 2.0 * t;
                t = _t - 1.0;
                t = 1.0 - t * t;
                if (_t < 1.0) {
                    const z = (1.0 - t) * this.clickZOffsetSnapshot + t * this.constants.DEFAULT_CAMERA_POSITION[2];
                    this.camera.position[2] = z;
                }
                else {
                    const z = (1.0 - t) * -this.constants.MAIN_SPHERE_RADIUS + t * this.constants.DEFAULT_CAMERA_POSITION[2];
                    this.camera.position[2] = z;
                }
            }
        }
        // zoom out only
        else {
            t = t * t;
            const z = (1.0 - t) * this.clickZOffsetSnapshot + t * this.constants.DEFAULT_CAMERA_POSITION[2];
            this.camera.position[2] = z;
        }
    }
    FrameUpdate(timeSinceLoad, currentFrame) {
        this.currentFrame = currentFrame;
        if ((timeSinceLoad - this.uniforms.time) < this.TARGET_MS) {
            return;
        }
        this.uniforms.Update(timeSinceLoad);
        this.UpdateCameraPosition(this.uniforms);
        this.UpdateRotationMatrix(this.uniforms, this.uniforms.mouseDelta);
        this.CalculateMouseInfluenceWeights(this.uniforms, this.camera);
        this.UpdateHTMLElements(this.uniforms, this.camera);
        if (this.programInfo !== null) {
            this.gl.SetActiveProgram(this.programInfo);
            this.programInfo.UpdateUniforms(this.gl.gl, this.uniforms, this.camera, this.rotationMatrix, this.fSphereDir);
            this.programInfo.Execute(this.gl.gl);
        }
        this.UpdatePageData();
        this.UpdatePageInfosDisplay(this.uniforms);
        this.uniforms.PostUpdate();
        this.mouseDelta = [0.0, 0.0]; // reset to 0 every frame for when mouse stops moving
    }
}
function Render(timeSinceLoad) {
    const currentFrame = requestAnimationFrame(Render);
    pageManager.FrameUpdate(timeSinceLoad, currentFrame);
}
function StartRender() {
    Render(0.0);
}
export const pageManager = new PageManager();
