import { FC } from "react";
import { Outlet } from "react-router-dom";
import { NavMenu } from "./NavMenu";
import "./MainLayout.css"

interface IProps {
    className?: string;
}

export const MainLayout: FC<IProps> = () => {
    return (
        <div className="flex absolute top-0 left-0 right-0 bottom-0">
            <NavMenu className="basis-48 shrink-0 grow-0" />
            <div className="basis-full shrink px-10 py-7 overflow-scroll mainLayout">
                <Outlet />
            </div>
        </div>
    );
};
