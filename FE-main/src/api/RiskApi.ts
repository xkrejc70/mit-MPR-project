import { BaseApi } from ".";
import { ICreateRisk, IRisk, IUpdateRisk } from "../types";

export async function getProjectRisk(pk: string): Promise<IRisk[]> {
    return (await BaseApi.get<IRisk[]>(`/project_risks/${pk}`)).data;
}

export async function deleteProjectRisk(pk: number): Promise<any> {
    return await BaseApi.get(`/delete_risk/${pk}`);
}
export async function getAll(): Promise<IRisk[]> {
    return (await BaseApi.get<IRisk[]>("/all_risks")).data;
}

export async function createProjectRisk(data: ICreateRisk): Promise<IRisk[]> {
    var bodyFormData = new FormData();
    bodyFormData.append("title", data.title);
    bodyFormData.append("description", data.description);
    bodyFormData.append("danger", data.danger);
    bodyFormData.append("trigger", data.trigger);
    bodyFormData.append("reactions", data.reactions);
    bodyFormData.append("status", data.status.toString());
    bodyFormData.append("impact", data.impact.toString());
    bodyFormData.append("probability", data.probability.toString());
    bodyFormData.append("project", data.project_pk);
    bodyFormData.append("phase", "CONCEPT");
    bodyFormData.append("category", data.category.toString());
    bodyFormData.append("date_identified", new Date().toISOString().substring(0, 10));
    bodyFormData.append("date_reaction", new Date().toISOString().substring(0, 10));
    bodyFormData.append("date_updated", new Date().toISOString().substring(0, 10));
    return (await BaseApi.post<IRisk[]>(`/create_risk`, bodyFormData)).data;
}

export async function updateProjectRisk(data: IUpdateRisk): Promise<IRisk[]> {
    var bodyFormData = new FormData();
    bodyFormData.append("status", data.status);
    bodyFormData.append("pk", data.pk.toString());
    return (await BaseApi.post<IRisk[]>(`/update_risk`, bodyFormData)).data;
}

