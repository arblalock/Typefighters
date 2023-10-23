import { EleSize } from "@/types/comp-types";

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

export const getTextSize = (size : EleSize) : string =>{
    return constructClass(size, 't');
}