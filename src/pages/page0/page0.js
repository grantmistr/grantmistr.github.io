import { PageInfo } from "../pageInfo.js";
export class Page0Info extends PageInfo {
    constructor(dataURL) {
        super(dataURL, () => { this.Init(); });
    }
    Init() {
        this.UpdateHeaderButtonLogoViewBox();
    }
    UpdateHeaderButtonLogoViewBox() {
        const headerButtonLogos = this.wrapper.querySelectorAll('.headerButtonLogo');
        headerButtonLogos.forEach((headerButtonLogo) => {
            const clone = headerButtonLogo.cloneNode(true);
            document.body.appendChild(clone);
            const path = clone.querySelector('path');
            if (path !== null) {
                const rect = path.getBBox();
                headerButtonLogo.setAttribute('viewBox', rect.x + ' ' + rect.y + ' ' + rect.width + ' ' + rect.height);
            }
            document.body.removeChild(clone);
        });
    }
}
