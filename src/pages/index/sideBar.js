import { NiceNames, PAGE_COUNT, PageNames } from "../../pageManager/pageManager.js";
export function InitSideBar() {
    const sideBar = document.getElementById('sideBar');
    const toggle = document.getElementById('navToggleButton');
    for (let i = 0; i < PAGE_COUNT; i++) {
        const navButton = document.createElement('div');
        navButton.className = 'navButton';
        navButton.id = navButton.className + i.toString();
        navButton.onclick = () => {
            location.hash = PageNames[i];
        };
        navButton.ontouchend = () => {
            location.hash = PageNames[i];
        };
        const navButtonText = document.createElement('div');
        navButtonText.className = 'navButtonText';
        navButtonText.id = navButtonText.className + i.toString();
        navButtonText.textContent = NiceNames[i];
        const navButtonBackground = document.createElement('div');
        navButtonBackground.className = 'navButtonBackground';
        navButtonBackground.id = navButtonBackground.className + i.toString();
        navButton.appendChild(navButtonText);
        navButton.appendChild(navButtonBackground);
        sideBar.appendChild(navButton);
    }
}
