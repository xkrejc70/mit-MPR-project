import { FC } from "react";

interface IProps {
    className?: string;
}

export const Navigation: FC<IProps> = ({ className }) => {
    return (
        <div className={`flex px-10 gap-4 h-4 bg-mine-shaft-50 ${className || ""}`}>
            <div className="basis-full relative flex gap-5 items-center"></div>
        </div>
    );
};
