import { ReactNode } from 'react';

export const CenterContainer = ({ children }: { children: ReactNode }) => {
    return (
        <div className="flex flex-col m-4 items-center text-center justify-center">
            {children}
        </div>
    )
}