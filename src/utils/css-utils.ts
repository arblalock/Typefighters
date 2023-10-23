import { EleSize } from "@/types/comp-types";

export const constructTwClass = (size: string, prefix:string) : string =>{
    return `${prefix}-${size}`
}

export const getTwFontSize = (size : string) : string =>{
    return constructTwClass(size, 'text');
}
export const constructClass = (size: EleSize, prefix:string) : string =>{
    return `var(--${prefix}-${size})`
}


export const getPaddingSize = (size : EleSize) : string =>{
    return constructClass(size, 'p');
}

export const getMarginSize = (size : EleSize) : string =>{
    return constructClass(size, 'm');
}

export const getWidthSize = (size : EleSize) : string =>{
    return constructClass(size, 'w');
}