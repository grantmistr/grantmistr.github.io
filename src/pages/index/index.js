import { F_SPHERE_COUNT, F_SPHERE_DIRECTIONS } from "../../common/fibonacciSphere.js";
import { InitWebGL } from "../../webGL/webGL.js";
function Init() {
    UpdateHeaderButtonLogoViewBox();
    InitWebGL();
    //InitFibonacciSphereElements();
}
function UpdateHeaderButtonLogoViewBox() {
    const headerButtonLogos = document.querySelectorAll('.headerButtonLogo');
    headerButtonLogos.forEach((headerButtonLogo) => {
        let path = headerButtonLogo.querySelector('path');
        if (path != null) {
            let rect = path.getBBox();
            headerButtonLogo.setAttribute('viewBox', rect.x + ' ' + rect.y + ' ' + rect.width + ' ' + rect.height);
        }
    });
}
function InitFibonacciSphereElements() {
    const container = document.getElementById('container3D');
    if (container === null) {
        return;
    }
    const radius = 200;
    for (let i = 0; i < F_SPHERE_COUNT; i++) {
        const [x, y, z] = F_SPHERE_DIRECTIONS[i];
        const tx = x * radius;
        const ty = y * radius;
        const tz = z * radius;
        const element = document.createElement('div');
        element.className = 'item3D';
        element.textContent = i.toString();
        element.style.transform = `translate3D(${tx}px, ${ty}px, ${tz}px)`;
        container.appendChild(element);
    }
}
Init();
