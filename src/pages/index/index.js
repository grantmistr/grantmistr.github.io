"use strict";
function UpdateHeaderButtonLogoViewBox() {
    const headerButtonLogos = document.querySelectorAll('.headerButtonLogo');
    headerButtonLogos.forEach((headerButtonLogo) => {
        let path = headerButtonLogo.querySelector('path');
        if (path != null) {
            let rect = path.getBBox();
            headerButtonLogo.setAttribute('viewBox', rect.x + ' ' + rect.y + ' ' + rect.width + ' ' + rect.height);
        }
    });
}
UpdateHeaderButtonLogoViewBox();
