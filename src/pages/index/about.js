import { GetLocationIndex, PageIndices } from "../../pageManager/pageManager.js";
let scrollValue = 0.0;
let scrollVelocity = 0.0;
let timeSnapShot = 0.0;
let animationID = 0;
let resuming = false;
let pageIndices = [PageIndices._home, PageIndices._home];
let mousePos = [0.0, 0.0];
let prevMousePos = [0.0, 0.0];
const aboutToggleButton = document.getElementById('aboutToggleButton');
const aboutWrapper = document.getElementById('aboutWrapper');
const about = document.getElementById('about');
export function InitAbout() {
    window.onwheel = (e) => {
        if (pageIndices[0] === PageIndices._home) {
            scrollVelocity += e.deltaY * 0.0001;
            resuming = true;
            animationID = requestAnimationFrame(UpdateScrollValue);
        }
    };
    window.addEventListener('updatedPageIndices', ((e) => {
        pageIndices[0] = e.detail.index;
        pageIndices[1] = e.detail.previousIndex;
        if (pageIndices[0] !== PageIndices._home) {
            aboutToggleButton.style.pointerEvents = 'none';
            aboutToggleButton.setAttribute('state', 'hidden');
            ClearAboutOverlay();
        }
        else {
            aboutToggleButton.style.pointerEvents = 'auto';
            aboutToggleButton.setAttribute('state', 'visible');
        }
    }));
    aboutToggleButton.onclick = (e) => {
        if (pageIndices[0] === PageIndices._home) {
            aboutToggleButton.style.pointerEvents = 'none';
            aboutToggleButton.setAttribute('state', 'hidden');
            RestoreAboutOverlay();
        }
    };
    aboutWrapper.ontouchstart = (e) => {
        e.preventDefault();
        mousePos = [e.touches[0].clientX, e.touches[0].clientY];
        prevMousePos = mousePos;
    };
    aboutWrapper.ontouchmove = (e) => {
        e.preventDefault();
        prevMousePos = mousePos;
        mousePos = [e.touches[0].clientX, e.touches[0].clientY];
        const delta = [mousePos[0] - prevMousePos[0], -mousePos[1] + prevMousePos[1]];
        if (pageIndices[0] === PageIndices._home) {
            scrollVelocity += delta[1] * 0.0001;
            resuming = true;
            animationID = requestAnimationFrame(UpdateScrollValue);
        }
    };
    pageIndices[0] = GetLocationIndex(location.hash);
    if (pageIndices[0] !== PageIndices._home) {
        scrollValue = 1.0;
    }
    animationID = requestAnimationFrame(UpdateScrollValue);
}
function UpdateScrollValue(timeSinceLoad) {
    let timeDelta;
    if (resuming) {
        timeSnapShot = timeSinceLoad;
        timeDelta = 0.0001;
        resuming = false;
    }
    else {
        timeDelta = timeSinceLoad - timeSnapShot;
    }
    scrollValue += scrollVelocity * timeDelta * 0.08;
    scrollValue = Math.min(Math.max(scrollValue, 0.0), 1.0);
    //aboutWrapper.style.backdropFilter = `blur(${(1.0 - scrollValue) * 16.0}px)`;
    about.style.filter = `blur(${scrollValue * 15.9 + 0.1}px)`;
    //about.style.opacity = (1.0 - scrollValue).toString();
    aboutWrapper.style.opacity = (1.0 - scrollValue).toString();
    about.style.transform = `translateY(${scrollValue * -60.0}px)`;
    if (scrollValue >= 1.0) {
        aboutWrapper.style.pointerEvents = 'none';
        aboutWrapper.style.visibility = 'hidden';
        if (pageIndices[0] === PageIndices._home) {
            aboutToggleButton.style.pointerEvents = 'auto';
            aboutToggleButton.setAttribute('state', 'visible');
        }
    }
    else {
        aboutWrapper.style.pointerEvents = 'auto';
        aboutWrapper.style.visibility = 'visible';
        aboutToggleButton.style.pointerEvents = 'none';
        aboutToggleButton.setAttribute('state', 'hidden');
    }
    if ((scrollValue >= 1.0) || (scrollValue <= 0.0)) {
        scrollVelocity = 0.0;
        cancelAnimationFrame(animationID);
        return;
    }
    else {
        animationID = requestAnimationFrame(UpdateScrollValue);
    }
    scrollVelocity *= Math.max(1.0 - timeDelta * 0.01, 0.0);
    scrollVelocity = Math.abs(scrollVelocity) * Math.sign(scrollVelocity);
    timeSnapShot = timeSinceLoad;
}
function ClearAboutOverlay() {
    cancelAnimationFrame(animationID);
    scrollVelocity = 0.01;
    resuming = true;
    animationID = requestAnimationFrame(UpdateScrollValue);
}
function RestoreAboutOverlay() {
    scrollVelocity += -0.01;
    resuming = true;
    animationID = requestAnimationFrame(UpdateScrollValue);
}
