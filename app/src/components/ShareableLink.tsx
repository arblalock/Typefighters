'use client'

import { EleSize } from "@/types/comp-types";
import { getTextSize } from "@/utils/css-utils";
import { useState, useRef } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'

export const ShareableLink = ({ linkTxt, cb, textSize = 'xl' }: { linkTxt: string, cb?: Function, textSize?: EleSize }) => {

    const [mouseIsHovering, setMouseIsHovering] = useState<boolean>(false);
    const [linkHoverClass, setLinkHoverClass] = useState<string>('')
    const [linkClickedClass, setLinkClickedClass] = useState<string>('')
    const [linkDefaultClass, setLinkDefaultClass] = useState<string>('sh-link-default')
    const [linkIsClicked, setLinkIsClicked] = useState<boolean>(false);
    const [descTxt, setDescTxt] = useState<string>(linkTxt)
    const [linkAnimating, setLinkAnimating] = useState<Boolean>(false);
    const [linkWidth, setLinkWidth] = useState<Number>(0);
    const linkRef = useRef<any>(null);


    const handleOnMouseEnter = () => {
        setLinkWidth(linkRef.current ? linkRef.current.offsetWidth : null);
        setMouseIsHovering(true);
        if (linkAnimating == false && linkIsClicked == false) {
            setLinkHoverClass('sh-link-hover')
        } else {
            setLinkHoverClass('')
        }
    }

    const handleOnMouseLeave = () => {
        setMouseIsHovering(false);
        setLinkHoverClass('');
    }

    const handleLinkCopyClick = (isIconClick: Boolean) => {
        navigator.clipboard.writeText(descTxt)
        if (cb) {
            cb();
        }
        if (linkIsClicked && isIconClick == false) return;
        setLinkIsClicked(true);
        setDescTxt('Link copied!')
        setLinkAnimating(true);
        setLinkHoverClass('');
        setLinkClickedClass('sh-link-clicked');
        //Need to set width so that changing text does not modify width
        linkRef.current.style.width = `${linkWidth}px`
        setTimeout(() => resetLink(), 3000)
    }

    const resetLink = () => {
        setLinkDefaultClass('');
        setDescTxt(linkTxt);
        setLinkAnimating(false);
        setLinkClickedClass('');
    }

    return (
        <div ref={linkRef} className={`relative sh-link m-6 px-24 py-6 ${linkDefaultClass} ${linkHoverClass} ${linkClickedClass}`}
            style={{
                fontSize: getTextSize(textSize)
            }}
            onMouseEnter={() => handleOnMouseEnter()}
            onMouseLeave={() => handleOnMouseLeave()}
            onClick={() => handleLinkCopyClick(false)}>
            {(linkIsClicked || mouseIsHovering) &&
                <div
                    onClick={() => handleLinkCopyClick(true)}
                    className={`absolute px-[8%]  valign right-0 ${linkAnimating ? '' : 'icon-btn-dark'}`}>
                    <FontAwesomeIcon icon={faCopy} />
                </div>}
            {<span>{descTxt}</span>}
        </div>
    )
}
