import { pageManager } from "../../pageManager/pageManager.js";
import { InitAbout } from "./about.js";
import { InitSideBar } from "./sideBar.js";

function Init(): void
{
    pageManager.Initialize();
    InitSideBar();
    InitAbout();
}

Init();