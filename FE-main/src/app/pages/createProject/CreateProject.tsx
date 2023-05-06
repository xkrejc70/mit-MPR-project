import { FC } from "react";
import "./CreateProject.css"
import { CreateProjectForm } from "./CreateProjectForm";

interface IProps {
    className?: string;
}

export const CreateProject: FC<IProps> = () => {
    return (
        <div className="createProject">
            <h1>Vytvořit projekt</h1>
            <CreateProjectForm />
        </div>
    )
};
