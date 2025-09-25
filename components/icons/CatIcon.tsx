import React from 'react';

interface CatIconProps extends React.SVGProps<SVGSVGElement> {
  animation?: 'twitch' | 'pulse';
}

const CatIcon: React.FC<CatIconProps> = ({ animation, ...props }) => {
    const animationClass = animation === 'twitch'
        ? 'animate-ear-twitch'
        : animation === 'pulse'
            ? 'animate-cat-pulse'
            : '';

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            {...props}
        >
            <g className={animationClass}>
                {/* Faded head outline */}
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 13.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-7 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" opacity="0.3"/>
                {/* Ears */}
                <path className="ear-left" d="M9.5 8.5C9.5 6 7.5 4 7.5 4S5.5 6 5.5 8.5c0 1.5 1 2.5 2 2.5s2-1 2-2.5z" />
                <path className="ear-right" d="M14.5 8.5C14.5 6 16.5 4 16.5 4S18.5 6 18.5 8.5c0 1.5-1 2.5-2 2.5s-2-1-2-2.5z" />
                {/* Eyes */}
                <circle cx="10" cy="12" r="1.5" />
                <circle cx="14" cy="12" r="1.5" />
                {/* Mouth */}
                <path d="M12 15c-1.1 0-2 .9-2 2h4c0-1.1-.9-2-2-2z" />
            </g>
        </svg>
    );
};

export default CatIcon;