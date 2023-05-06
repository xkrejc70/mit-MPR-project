import axios, { AxiosResponse } from "axios";
import config from "../api-config";
import { BaseApiType } from "../types";

const BASE_URL = `${config.ApiEndpoint}`;

export function buildUrl(path: string, id?: number) {
    return `${BASE_URL}${path}${id ? "/" + id : ""}`;
}

const api = axios.create({
    withCredentials: true,
    headers: {
        "Access-Control-Allow-Credentials": "true",
    },
});

export function get<T>(path: string): Promise<AxiosResponse<T>> {
    return api.get(buildUrl(path)).then((result) => {
        return result;
    });
}

export function deleteBase<T>(path: string): Promise<BaseApiType<T>> {
    return api.delete(buildUrl(path)).then((result) => {
        return { items: result.data.items, message: result.data.message };
    });
}

export function post<T>(path: string, requestData?: unknown): Promise<AxiosResponse<T>> {
    return api.post(buildUrl(path), requestData).then((result) => result);
}
