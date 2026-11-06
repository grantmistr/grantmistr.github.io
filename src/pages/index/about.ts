let scrollValue = 0.0;
let scrollVelocity = 0.0;
let timeSnapShot = 0.0;
let animationID = 0;
let resuming = false;

const aboutWrapper = document.getElementById('aboutWrapper') as HTMLDivElement;
const about = document.getElementById('about') as HTMLDivElement;

export function InitAbout(): void
{
    window.onwheel = (e: WheelEvent) =>
    {
        scrollVelocity += e.deltaY * 0.0001;

        resuming = true;

        animationID = requestAnimationFrame(UpdateScrollValue);

    }, { passive: false };

    animationID = requestAnimationFrame(UpdateScrollValue);
}

function UpdateScrollValue(timeSinceLoad: number): void
{
    let timeDelta: number;

    if (resuming)
    {
        timeSnapShot = timeSinceLoad;
        timeDelta = 0.0001;
        resuming = false;
    }
    else
    {
        timeDelta = timeSinceLoad - timeSnapShot;
    }

    scrollValue += scrollVelocity * timeDelta * 0.08;
    scrollValue = Math.min(Math.max(scrollValue, 0.0), 1.0);

    //aboutWrapper.style.backdropFilter = `blur(${(1.0 - scrollValue) * 16.0}px)`;
    about.style.filter = `blur(${scrollValue * 15.9 + 0.1}px)`;
    //about.style.opacity = (1.0 - scrollValue).toString();
    aboutWrapper.style.opacity = (1.0 - scrollValue).toString();
    about.style.transform = `translateY(${scrollValue * -60.0}px)`;

    if (scrollValue >= 1.0)
    {
        aboutWrapper.style.pointerEvents = 'none'; 
        aboutWrapper.style.visibility = 'hidden';
    }
    else
    {
        aboutWrapper.style.pointerEvents = 'auto';
        aboutWrapper.style.visibility = 'visible';
    }

    if ((scrollValue >= 1.0) || (scrollValue <= 0.0))
    {
        scrollVelocity = 0.0;
        cancelAnimationFrame(animationID);
        return;
    }
    else
    {
        animationID = requestAnimationFrame(UpdateScrollValue);
    }

    scrollVelocity *= Math.max(1.0 - timeDelta * 0.004, 0.0);
    scrollVelocity = Math.max(Math.abs(scrollVelocity), 0.01) * Math.sign(scrollVelocity);

    timeSnapShot = timeSinceLoad;
}

export function ClearAboutOverlay(): void
{
    cancelAnimationFrame(animationID);
    scrollVelocity = 0.01;
    resuming = true;
    animationID = requestAnimationFrame(UpdateScrollValue);
}