import { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TeamUsersTable } from "./TeamUsersTable";

interface IProps {
    className?: string;
}

export const ProjectTeam: FC<IProps> = () => {
    const navigate = useNavigate();
    const { projectId } = useParams();
    return (
        <div className="projectTeam rounded-xl relative ">
            <span
                className="font-bold absolute top-2 left-4 cursor-pointer"
                onClick={() => {
                    navigate("/project/" + projectId);
                }}
            >
                {"<<"}
            </span>
            <h1>Lidé na projektu</h1>
            <TeamUsersTable />
        </div>
    );
};
