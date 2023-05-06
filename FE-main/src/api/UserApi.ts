import { ICreateUser, IUser } from "../types";
import { BaseApi } from "./index";

export async function getAll(): Promise<IUser[]> {
    return (await BaseApi.get<IUser[]>("/users")).data;
}

export async function update(data: ICreateUser, pk: number): Promise<ICreateUser> {
    var bodyFormData = new FormData();
    bodyFormData.append("name", data.name);
    bodyFormData.append("email", data.email);
    bodyFormData.append("role", data.role);
    bodyFormData.append("pk", pk.toString());
    return (await BaseApi.post<ICreateUser>(`/update_user`, bodyFormData)).data;
}

export async function deleteUser(pk: number): Promise<any> {
    return await BaseApi.get(`/delete_user/${pk}`);
}
