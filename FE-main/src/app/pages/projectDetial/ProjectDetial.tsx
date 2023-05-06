import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FC, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { ProjectApi } from "../../../api";
import { IcoDelete, IcoUser } from "../../../assets/icons";
import { IProject } from "../../../types";
import { ConfirmDeleteDialog } from "../../components/ConfirmDeleteDialog";
import { useAuth } from "../../context/AuthContext";
import { Matrix3x3 } from "./Matrix3x3";
import { Matrix5x5 } from "./Matrix5x5";
import "./ProjectDetail.css";
import { ShowRisks } from "./ShowRisks";

interface IProps {
    className?: string;
}

// TODO -> this subpage will be enetered through navigate from dashboard page so information about this project should be passed within navigate function
// with risks as well that are part of this project
// TODO risks from this particular project will be pass as props into ShowRisk component that displays every single risk (to be done)
// TODO -> if app role == project manager then there has to be button for adding people into project (maybe somewhere near the Project name) (navigate to /projectteam)
export const ProjectDetail: FC<IProps> = () => {
    const [deleteDialog, setDeleteDialog] = useState(false);
    let { projectId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const auth = useAuth();
    const [myRole, setMyRole] = useState<string | undefined>("NONE");

    const { data: project, isLoading } = useQuery({
        queryKey: ["project", projectId],
        queryFn: () => (projectId ? ProjectApi.getOne(projectId) : ({} as IProject)),
        onError: () => {
            toast.error("Something went wrong while loading project");
        },
    });

    const { data: projectUsers } = useQuery({
        queryKey: ["projectUsers"],
        queryFn: () => (projectId ? ProjectApi.getUsers(projectId) : []),
        onError: () => {
            toast.error("Nepodařilo se načíst uživatele projektu.");
        },
        onSuccess: (data) => {
            setMyRole(data.find((item) => item.fields.user === auth.user?.pk)?.fields.role);
        },
    });

    const { mutate: deleteProject } = useMutation({
        mutationFn: (pk: number) => {
            return ProjectApi.deleteProject(pk);
        },
        onSuccess: () => {
            toast.success("Projekt byl úspěšně smazán");
            queryClient.resetQueries(["project", projectId]);
            navigate("/");
        },
        onError: () => {
            toast.error("Smazání projektu selhalo");
        },
    });

    const confirmDeleteProject = () => {
        setDeleteDialog(true);
    };

    return (
        <div className="project-detail">
            {isLoading && <p>Loading...</p>}
            {!isLoading && (
                <>
                    <h1 className="flex">
                        {project?.fields?.name}
                        <>
                            {(myRole === "MANAGER" || auth.user?.fields.role == "ADMIN") && (
                                <IcoDelete
                                    className="ml-4 cursor-pointer"
                                    width={"25px"}
                                    fill="red"
                                    onClick={() => (project ? confirmDeleteProject() : null)}
                                />
                            )}
                            <IcoUser className="ml-4 cursor-pointer" width={"25px"} onClick={() => navigate("/project/" + projectId + "/projectteam")} />
                        </>
                    </h1>
                    <ShowRisks />
                    <div className="flex mt-4">
                        {(myRole !== "EXTERNAL" || auth.user?.fields.role == "ADMIN") && (
                            <button
                                onClick={() => navigate("createrisk")}
                                className="basis-full bg-mine-shaft-50 text-white text-xl my-2 mx-10 rounded-lg h-14"
                            >
                                Vytvořit riziko
                            </button>
                        )}
                    </div>
                    {project?.fields?.scale_risk ? <Matrix3x3 /> : <Matrix5x5 />}
                </>
            )}
            <ConfirmDeleteDialog
                open={deleteDialog}
                name={project ? project.fields.name : ""}
                type="projekt"
                onClose={() => setDeleteDialog(false)}
                onYes={() => deleteProject(project ? project.pk : -1)}
            />
        </div>
    );
};
