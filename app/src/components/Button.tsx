'use client'
import { EleSize } from '@/types/comp-types';
import { getMarginSize, getPaddingSize, getTextSize } from '@/utils/css-utils';
import { useRouter } from 'next/navigation';

interface ButtonProps {
    url?: string | null;
    callback?: Function | null;
    textSize: EleSize;
    buttonStyle: ButtonStyle | string;
    text: string
}

export type ButtonStyle = 'primary' | 'alt1' | 'disabled'

export const Button = ({ url, textSize, buttonStyle, text, callback }: ButtonProps) => {

    const router = useRouter();

    const handleClick = () => {
        if (typeof url === 'string') {
            router.push(url);
            return;
        }
        if (typeof callback === 'function') {
            callback();
        }
    }

    return (
        <div onClick={handleClick}
            style={{
                fontSize: getTextSize(textSize),
                margin: getMarginSize('xl'),
                padding: `${getPaddingSize('lg')} ${getPaddingSize('xl')}`
            }}
            className={`btn btn-${buttonStyle}`}>
            <div>{text}</div>
        </div>
    )
}