import { FC } from "react";
import "./Login.css";
import { LoginForm } from "./LoginForm";

interface IProps {
    className?: string;
}

export const Login: FC<IProps> = () => {
    return (
        <div className="w-[100vw] h-[100vh] loginBackgroundImage">
            <div className="absolute bottom-16 left-16 flex">
                <div className="w-16 h-16 bg-red m-4"></div>
                <h1 className="m-4 ml-8 p-0 text-6xl text-white" style={{ fontFamily: "Courier New, Courier, monospace" }}>
                    Risk Management System
                </h1>
            </div>
            <div className="w-[500px] h-full float-right flex justify-center items-center">
                <LoginForm />
            </div>
            <span className="text-lg absolute bottom-8 right-12 text-slate-300">Beerlovers @ 2023</span>
        </div>
    );
};
