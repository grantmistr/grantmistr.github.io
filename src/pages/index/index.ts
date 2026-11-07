import { InitPageManager } from "../../pageManager/pageManager.js";
import { InitAbout } from "./about.js";
import { InitSideBar } from "./sideBar.js";

function Init(): void
{
    InitPageManager();
    InitSideBar();
    InitAbout();
}

Init();