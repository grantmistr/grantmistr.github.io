export class PageInfo
{
    public readonly wrapper: HTMLDivElement;

    /**
     * 
     * @param dataURL Path to file with HTML data
     * @param onLoad Optional function; called after data has been loaded
     */
    public constructor(dataURL: string | null, onLoad: (() => void) | undefined = undefined)
    {
        this.wrapper = document.createElement('div');
        if (dataURL !== null)
        {
            this.LoadData(dataURL, onLoad);
        }
    }

    private async LoadData(dataURL: string, onLoad: (() => void) | undefined): Promise<void>
    {
        const response = await fetch(dataURL);

        if (!response.ok)
        {
            throw new Error(response.statusText);
        }

        const data = await response.text();
        const doc = new DOMParser().parseFromString(data, 'text/html');
        this.wrapper.append(...doc.body.childNodes);

        if (onLoad !== undefined)
        {
            onLoad();
        }
    }
}