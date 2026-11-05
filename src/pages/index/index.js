import { pageManager } from "../../pageManager/pageManager.js";
import { InitAbout } from "./about.js";
import { InitSideBar } from "./sideBar.js";
function Init() {
    pageManager.Initialize();
    InitSideBar();
    InitAbout();
}
Init();
