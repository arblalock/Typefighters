import { UrlObject } from 'url';

interface ButtonProps {
    url: UrlObject | string;
    size: ButtonS;
}
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export const Button = ({ url, size }: ButtonProps) => {

    return (
        <div>
            <div>Button</div>
        </div>
    )
}