import { JSX } from 'react';
import './logoButton.css';

interface PathProps
{
    d: string;
    fill: string;
}

interface LogoButtonProps
{
    paths: PathProps[];
    text: string;
    link: string;
}

function LogoButton({paths, text, link}: LogoButtonProps): JSX.Element
{
    const p: JSX.Element[] = [];

    for (let i = 0; i < paths.length; i++)
    {
        const pathProps = paths[i];
        p.push(<path d={pathProps.d} fill={pathProps.fill}/>);
    }

    for (let i = 0; i < paths.length; i++)
    {
        const rect = p[i];
    }

    return (
        <div className="outer">
            <div className="inner">
                <a href={link}>
                    <svg className="logo">
                        {p}
                    </svg>
                    <p className="text">
                        {text}
                    </p>
                </a>
            </div>
        </div>
    );
}

export default LogoButton;