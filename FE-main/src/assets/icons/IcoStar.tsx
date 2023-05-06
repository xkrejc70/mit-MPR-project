import React, { FC, SVGProps } from 'react';

export const IcoStar: FC<SVGProps<SVGSVGElement>> = (props) => {
    return (
        <svg viewBox="0 0 512 512" {...props}>
            <polygon
                stroke="#1D1D1B"
                points="
259.216,29.942 330.27,173.919 489.16,197.007 374.185,309.08 401.33,467.31 259.216,392.612 117.104,467.31 144.25,309.08
29.274,197.007 188.165,173.919 "
            />
        </svg>
    );
};
