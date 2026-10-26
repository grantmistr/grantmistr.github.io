import { NiceNames, PAGE_COUNT, PageNames } from "../../pageManager/pageManager.js";
export function InitSideBar() {
    const sideBar = document.getElementById('sideBar');
    const toggle = document.getElementById('sideBarToggleButton');
    const sideBarWrapper = document.getElementById('sideBarWrapper');
    const toggleData = new WeakMap();
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
    toggleData.set(toggle, false);
    sideBarWrapper.setAttribute('state', 'closed');
    toggle.onclick = OnToggleClick;
    toggle.ontouchend = OnToggleClick;
    function OnToggleClick() {
        const toggleState = toggleData.get(toggle);
        toggleData.set(toggle, !toggleState);
        if (toggleState) {
            sideBarWrapper.setAttribute('state', 'closed');
        }
        else {
            sideBarWrapper.setAttribute('state', 'open');
        }
    }
}
