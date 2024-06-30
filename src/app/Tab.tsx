import { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition, faClose } from '@fortawesome/free-solid-svg-icons';
import Tooltip from './Tooltip';
import { isOverflown } from '../lib/utils';

export default function Tab({ name, icon, active, onClick, onClose, toolTip }: {
    name: string,
    icon: IconDefinition,
    active: boolean,
    onClick: React.MouseEventHandler<HTMLDivElement>,
    onClose?: React.MouseEventHandler<SVGSVGElement>,
    toolTip?: boolean
}) {
    const overflownRef = useRef<HTMLDivElement>(null);

    return (
        <div className='flex items-end h-full mr-[8px]'>
            <Tooltip
                text={name}
                disabled={!toolTip || !active || !isOverflown(overflownRef)}
            >
                <div ref={overflownRef}
                    onClick={onClick}
                    className={(active ? 'bg-[#ffffff] ' : 'bg-[#c3ccd2] hover:bg-[#d0d9de] ')
                        + ' group relative h-[32px] max-w-[245px] text-[#394146] text-sm text-ellipsis overflow-hidden cursor-pointer'}
                    style={{
                        userSelect: 'none',
                        padding: '6px 8px 6px 8px',
                        borderRadius: '6px 6px 0 0',
                        whiteSpace: 'nowrap'
                    }}
                >
                    <FontAwesomeIcon icon={icon} className='mr-[8px]' />
                    <span>
                        {name}
                    </span>
                    {onClose &&
                        <div className='absolute flex justify-end items-center top-0 left-0 h-full w-full'>
                            <div className={(active ? 'bg-[#ffffff] ' : 'bg-[#c3ccd2] group-hover:bg-[#d0d9de] ')}>
                                <FontAwesomeIcon
                                    icon={faClose}
                                    className='mr-2 cursor-pointer'
                                    onClick={onClose}
                                />
                            </div>
                        </div>
                    }
                </div>
            </Tooltip>
        </div>
    )
}
