import { ICategory, ICreateCategory, IProject } from "../types";
import { BaseApi } from "./index";

export async function getAll(): Promise<ICategory[]> {
    return (await BaseApi.get<ICategory[]>("/risk_categories")).data;
}

export async function create(data: ICreateCategory): Promise<IProject> {
    var bodyFormData = new FormData();
    bodyFormData.append("name", data.name);
    bodyFormData.append("description", data.description);
    return (await BaseApi.post<IProject[]>(`/create_risk_category`, bodyFormData)).data[0];
}
