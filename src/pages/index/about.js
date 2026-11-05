let scrollValue = 0.0;
export function InitAbout() {
    const aboutWrapper = document.getElementById('aboutWrapper');
    const about = document.getElementById('about');
    window.onwheel = (e) => {
        scrollValue += e.deltaY * 0.0008;
        scrollValue = Math.min(Math.max(scrollValue, 0.0), 1.0);
        aboutWrapper.style.backdropFilter = `blur(${(1.0 - scrollValue) * 16.0}px)`;
        about.style.filter = `blur(${scrollValue * 15.9 + 0.1}px)`;
        about.style.opacity = (1.0 - scrollValue).toString();
        about.style.transform = `translateY(${scrollValue * -60.0}px)`;
        if (scrollValue >= 1.0) {
            aboutWrapper.style.pointerEvents = 'none';
        }
        else {
            aboutWrapper.style.pointerEvents = 'auto';
        }
    }, { passive: false };
}
