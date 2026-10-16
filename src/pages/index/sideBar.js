import { NiceNames, PAGE_COUNT, PageNames } from "../../pageManager/pageManager.js";
export function InitSideBar() {
    const sideBar = document.getElementById('sideBar');
    const toggle = document.getElementById('navToggleButton');
    for (let i = 0; i < PAGE_COUNT; i++) {
        const e = document.createElement('div');
        e.className = 'navButton';
        e.id = e.className + i.toString();
        e.textContent = NiceNames[i];
        e.onclick = () => {
            location.hash = PageNames[i];
        };
        e.ontouchend = () => {
            location.hash = PageNames[i];
        };
        sideBar.appendChild(e);
    }
}
