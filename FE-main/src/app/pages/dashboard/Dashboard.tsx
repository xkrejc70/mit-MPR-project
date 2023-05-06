import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { ProjectApi } from "../../../api";
import "./Dashboard.css";
import { DashboardProject } from "./DashboardProjects";

interface IProps {
    className?: string;
}

export const Dashboard: FC<IProps> = () => {
    const { data: projects, isLoading } = useQuery({
        queryKey: ["projects"],
        queryFn: () => ProjectApi.getAll(),
    });

    return (
        <div className="dashboard">
            <h1>Projekty</h1>
            {isLoading && <div className="text-gray text-lg mt-4">Loading...</div>}
            {(!projects || projects.length === 0) && <div className="text-gray text-lg  mt-4">Not Found</div>}
            {projects && projects.map((project) => <DashboardProject key={project.pk} project={project} />)}
        </div>
    );
};
