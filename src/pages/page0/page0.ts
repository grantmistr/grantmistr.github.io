import { PageInfo } from "../pageInfo.js";

export class Page0Info extends PageInfo
{
    public constructor(dataURL: string)
    {
        super(dataURL, () => { this.Init(); });
    }

    private Init(): void
    {
        this.UpdateHeaderButtonLogoViewBox();
    }

    private UpdateHeaderButtonLogoViewBox(): void
    {
        const headerButtonLogos: NodeListOf<SVGElement> = this.wrapper.querySelectorAll<SVGElement>('.headerButtonLogo');

        headerButtonLogos.forEach((headerButtonLogo) =>
        {
            const clone = headerButtonLogo.cloneNode(true) as SVGElement;
            document.body.appendChild(clone);

            const path: SVGPathElement | null = clone.querySelector<SVGPathElement>('path');

            if (path !== null)
            {
                const rect: DOMRect = path.getBBox();
                headerButtonLogo.setAttribute('viewBox', rect.x + ' ' + rect.y + ' ' + rect.width + ' ' + rect.height);
            }

            document.body.removeChild(clone);
        });
    }
}