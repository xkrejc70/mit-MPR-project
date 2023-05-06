export interface ICreateCategory {
    name: string;
    description: string;
}

export interface ICategory {
    pk: number;
    fields: ICreateCategory;
    model?: string;
}
