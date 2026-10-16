import { pageManager } from "../../pageManager/pageManager.js";
import { InitSideBar } from "./sideBar.js";
function Init() {
    pageManager.Initialize();
    InitSideBar();
}
Init();
