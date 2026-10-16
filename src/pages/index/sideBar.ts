import { NiceNames, PAGE_COUNT, PageNames } from "../../pageManager/pageManager.js";

export function InitSideBar(): void
{
    const sideBar = document.getElementById('sideBar') as HTMLDivElement;
    const toggle = document.getElementById('navToggleButton') as HTMLDivElement;

    for (let i = 0; i < PAGE_COUNT; i++)
    {
        const e = document.createElement('div');
        e.className = 'navButton';
        e.id = e.className + i.toString();
        e.textContent = NiceNames[i];

        e.onclick = () =>
        {
            location.hash = PageNames[i];
        }

        sideBar.appendChild(e);
    }
}