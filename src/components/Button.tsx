'use client'
import { EleSize } from '@/types/comp-types';
import { getMarginSize, getPaddingSize, getTwFontSize, getWidthSize } from '@/utils/css-utils';
import { useRouter } from 'next/navigation';

interface ButtonProps {
    url: string;
    btnSize: EleSize;
    textSize: EleSize;
    buttonStyle: ButtonStyle | string;
    text: string
}

export type ButtonStyle = 'primary' | 'alt1'

export const Button = ({ url, btnSize: size, textSize, buttonStyle, text }: ButtonProps) => {

    const router = useRouter();

    const handleClick = () => {
        router.push(url);
    }

    return (
        <div onClick={handleClick}
            style={{ margin: getMarginSize(size), padding: `${getPaddingSize('lg')} ${getPaddingSize(size)}` }}
            className={`btn btn-${buttonStyle} ${getTwFontSize(textSize)}`}>
            <div>{text}</div>
        </div>
    )
}