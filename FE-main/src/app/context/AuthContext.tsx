import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React, { createContext, useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { AuthApi } from "../../api";
import { IUser } from "../../types";

interface IUseAuth {
    user: IUser | null;
    authState: "idle" | "success" | "fail" | "inProgress";
    logIn: (loginCred: { login: string; password: string }) => void;
    logOut: () => void;
    authenticate: () => void;
    loginError: string | undefined;
    loginLoading: boolean;
}

const initAuth: IUseAuth = {
    loginLoading: false,
    user: null,
    loginError: undefined,
    authState: "idle",
    logIn: () => {},
    logOut: () => {},
    authenticate: () => {},
};

function useProvideAuth() {
    const [user, setUser] = useState<IUser | null>(null);
    const [loginError, setLoginError] = useState<string | undefined>();
    const [authState, setAuthState] = useState<"idle" | "success" | "fail" | "inProgress">("idle");

    const { mutate: authenticate } = useMutation({
        mutationFn: () => {
            setAuthState("inProgress");
            return AuthApi.authenticate();
        },
        onSuccess: (resp) => {
            setUser(resp[0]);
            setAuthState("success");
        },
        onError: (err: AxiosError<{ message: string }>) => {
            setAuthState("fail");
        },
    });

    const { mutate: logIn, isLoading: loginLoading } = useMutation({
        mutationFn: (data: { login: string; password: string }) => {
            setAuthState("inProgress");
            return AuthApi.logIn(data);
        },
        onSuccess: (resp) => {
            setUser(resp[0]);
            setAuthState("success");
        },
        onError: (err: AxiosError<{ message: string }>) => {
            setAuthState("fail");
            setLoginError(err.response?.data.message);
            toast.error("Login error");
        },
    });

    const { mutate: logOut } = useMutation({
        mutationFn: () => {
            setAuthState("inProgress");
            return AuthApi.logout();
        },
        onSuccess: () => {
            setAuthState("fail");
            setUser(null);
        },
        onError: (err: AxiosError<{ message: string }>) => {
            setAuthState("fail");
            setLoginError(err.response?.data.message);
        },
    });

    return { user, authState, logIn, loginError, loginLoading, logOut, authenticate };
}

export const AuthContext: React.Context<IUseAuth> = createContext<IUseAuth>(initAuth);

export const useAuth = () => {
    return useContext(AuthContext);
};

export function AuthProvider(props: { children: JSX.Element }) {
    const auth = useProvideAuth();
    return <AuthContext.Provider value={auth}>{props.children}</AuthContext.Provider>;
}
