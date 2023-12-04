import { ReactNode } from 'react';

type CenterContProps = {
    margin?: number;
    children: ReactNode
}

export const CenterContainer = ({ children, margin = 1 }: CenterContProps) => {
    return (
        <div style={{
            margin: `${margin}rem`,
        }}
            className="flex flex-col items-center text-center justify-center">
            {children}
        </div>
    )
}