import { ICreateProject, IProject, IProjectRole } from "../types";
import { BaseApi } from "./index";

export async function getAll(): Promise<IProject[]> {
    return (await BaseApi.get<IProject[]>("/projects")).data;
}

export async function getUsers(pk: string): Promise<IProjectRole[]> {
    return (await BaseApi.get<IProjectRole[]>(`/project_roles/${pk}`)).data;
}

export async function getOne(pk: string): Promise<IProject> {
    return (await BaseApi.get<IProject[]>(`/project/${pk}`)).data[0];
}

export async function deleteProject(pk: number): Promise<any> {
    return await BaseApi.get(`/delete_project/${pk}`);
}
export async function deleteProjectUser(pk: number): Promise<any> {
    return await BaseApi.get(`/delete_project_role/${pk}`);
}

export async function createProject(data: ICreateProject): Promise<IProject[]> {
    var bodyFormData = new FormData();
    bodyFormData.append("name", data.name);
    bodyFormData.append("description", data.description);
    bodyFormData.append("date_begin", data.startDate.toISOString().substring(0, 10));
    bodyFormData.append("date_end", data.endDate.toISOString().substring(0, 10));
    bodyFormData.append("scale_risk", data.scale ? "True" : "False");
    bodyFormData.append("status", "CONCEPT");
    return (await BaseApi.post<IProject[]>(`/create_project`, bodyFormData)).data;
}

export async function createProjectUser(data: { user: number; project: string; role: string }): Promise<IProject[]> {
    var bodyFormData = new FormData();
    bodyFormData.append("user", data.user.toString());
    bodyFormData.append("project", data.project);
    bodyFormData.append("role", data.role);
    return (await BaseApi.post<IProject[]>(`/create_project_role`, bodyFormData)).data;
}
