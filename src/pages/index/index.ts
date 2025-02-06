function UpdateHeaderButtonLogoViewBox()
{
    const headerButtonLogos: NodeListOf<SVGElement> = document.querySelectorAll<SVGElement>('.headerButtonLogo');

    headerButtonLogos.forEach((headerButtonLogo) =>
    {
        let path: SVGPathElement | null = headerButtonLogo.querySelector<SVGPathElement>('path');

        if (path != null)
        {
            let rect: DOMRect = path.getBBox();
            headerButtonLogo.setAttribute('viewBox', rect.x + ' ' + rect.y + ' ' + rect.width + ' ' + rect.height);
        }
    });
}

UpdateHeaderButtonLogoViewBox();