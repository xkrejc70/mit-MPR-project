import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { IProject } from "../../../types";
import "./Dashboard.css";

interface IProps {
    className?: string;
    project: IProject;
}

export const DashboardProject: FC<IProps> = ({ project }) => {
    const navigate = useNavigate();

    return (
        <div className="project">
            <div className="columnInfo">
                <h1>{project.fields.name}</h1>
                <p>{project.fields.description}</p>
            </div>
            <div className="columnStats">
                <button onClick={() => navigate("/project/" + project.pk)}>Do projektu</button>
            </div>
        </div>
    );
};
