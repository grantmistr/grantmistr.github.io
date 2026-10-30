import { NiceNames, PAGE_COUNT, PageNames } from "../../pageManager/pageManager.js";

let sideBarToggleButtonToggleState = false;

export function InitSideBar(): void
{
    const sideBar = document.getElementById('sideBar') as HTMLDivElement;
    const sideBarToggleButton = document.getElementById('sideBarToggleButton') as HTMLDivElement;
    const sideBarWrapper = document.getElementById('sideBarWrapper') as HTMLDivElement;

    for (let i = 0; i < PAGE_COUNT; i++)
    {
        const navButton = document.createElement('div');
        navButton.className = 'navButton';
        navButton.id = navButton.className + i.toString();

        navButton.onclick = () =>
        {
            location.hash = PageNames[i];
        };

        navButton.ontouchend = () =>
        {
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

    sideBarToggleButton.setAttribute('state', 'closed');
    sideBarWrapper.setAttribute('state', 'closed');

    sideBarToggleButton.onclick = OnToggleButtonClick;
    sideBarToggleButton.ontouchend = OnToggleButtonClick;

    function OnToggleButtonClick()
    {
        sideBarToggleButtonToggleState = !sideBarToggleButtonToggleState;

        if (sideBarToggleButtonToggleState)
        {
            sideBarToggleButton.setAttribute('state', 'open');
            sideBarWrapper.setAttribute('state', 'open');
        }
        else
        {
            sideBarToggleButton.setAttribute('state', 'closed');
            sideBarWrapper.setAttribute('state', 'closed');
        }
    }
}