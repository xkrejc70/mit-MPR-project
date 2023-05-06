export interface IUser {
    pk: number;
    model?: string;
    fields: {
        name: string;
        surname: string;
        email: string;
        role: string;
        last_login?: string;
    };
}

export interface ICreateUser {
    name: string;
    surname: string;
    email: string;
    role: string;
    last_login?: string;
}

export interface IUserLogin {
    login: string;
    password: string;
}

export enum AppRoles {
    ADMIN = "ADMIN",
    PROJECT_MANAGER = "PROJECT_MANAGER",
    USER = "USER",
    NONE = "NONE",
}
