export enum ERiskCats {
    TINY,
    LOW,
    MEDIUM,
    HIGH,
    EXTREME,
}

export enum ERiskStatus {
    CONCEPT,
    ACTIVE,
    CLOSED,
    DELETED,
    TRANSPIRED,
}

export interface IRisk {
    pk: number;
    fields: {
        title: string;
        description: string;
        danger: string;
        trigger: string;
        reactions: string;
        status: string;
        impact: string;
        probability: string;
        owner: number
        project_pk: string;
        category: number;
    };
    model?: string;
}

export interface ICreateRisk {
    title: string;
    description: string;
    danger: string;
    trigger: string;
    reactions: string;
    status: string;
    impact: string;
    probability: string;
    project_pk: string;
    category: number;
}

export interface IUpdateRisk {
    status: string;
    pk: number
}
