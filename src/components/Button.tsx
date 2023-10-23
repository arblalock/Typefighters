'use client'
import { EleSize } from '@/types/comp-types';
import { getMarginSize, getPaddingSize, getTextSize, getTwFontSize, getWidthSize } from '@/utils/css-utils';
import { useRouter } from 'next/navigation';

interface ButtonProps {
    url: string;
    textSize: EleSize;
    buttonStyle: ButtonStyle | string;
    text: string
}

export type ButtonStyle = 'primary' | 'alt1'

export const Button = ({ url, textSize, buttonStyle, text }: ButtonProps) => {

    const router = useRouter();

    const handleClick = () => {
        router.push(url);
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