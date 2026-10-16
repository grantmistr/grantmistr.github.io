import { pageManager } from "../../pageManager/pageManager.js";
import { InitSideBar } from "./sideBar.js";

function Init(): void
{
    pageManager.Initialize();
    InitSideBar();
}

Init();