import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { ProjectApi } from "../../../api";
import { IProject } from "../../../types";
import "./CreateRisk.css";
import { CreateRiskForm } from "./CreateRiskForm";

interface IProps {
    className?: string;
}

export const CreateRisk: FC<IProps> = () => {
    let { projectId } = useParams();

    const { data: project, isLoading } = useQuery({
        queryKey: ["project", projectId],
        queryFn: () => (projectId ? ProjectApi.getOne(projectId) : ({} as IProject)),
        onError: () => {
            toast.error("Something went wrong while loading project");
        },
    });

    return (
        <div className="createRisk">
            <h1>Vytvořit riziko k projektu {project?.fields.name}</h1>
            {isLoading && <p>Loading...</p>}
            {!isLoading && project && <CreateRiskForm project={project} />}
        </div>
    );
};
