import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FC, useState } from "react";
import Form from "react-bootstrap/Form";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { CategoryApi, ProjectApi, RiskApi, UserApi } from "../../../api";
import { IcoDelete } from "../../../assets/icons";
import { IRisk, IUpdateRisk, IUser } from "../../../types";
import { ConfirmDeleteDialog } from "../../components/ConfirmDeleteDialog";
import { useAuth } from "../../context/AuthContext";
import "./ProjectDetail.css";

interface IProps {
    className?: string;
}

// TODO -> if Project role == MANAGER then he should be able to change status of the risk -> need to be done (add button to change status maybe next to risk name)
// TODO -> if project role == EMPLOYEE there should be button for adding new risk which will navigate user to /createrisk page
// TODO -> this is just layout for one risk -> there should be .map function that maps over all risks and displays them
// didnt create types yet
export const ShowRisks: FC<IProps> = () => {
    let { projectId } = useParams();

    const { data: projectData, isLoading: projectLoading } = useQuery({
        queryKey: ["project_risk", projectId],
        queryFn: () => (projectId ? RiskApi.getProjectRisk(projectId) : []),
        onError: () => {
            toast.error("Něco se pokazilo při načítání rizik projektu");
        },
    });

    const { data: userData, isLoading: userLoading } = useQuery({
        queryKey: ["users"],
        queryFn: () => UserApi.getAll(),
        onError: () => {
            toast.error("Něco se pokazilo při načítání uživatelů");
        },
    });

    if (projectLoading || userLoading) {
        return <div>Loading...</div>;
    }

    if (!projectData || !userData) {
        return <div>Not Found</div>;
    }

    return (
        <>
            {projectData?.map((risk) => (
                <Risk key={risk.pk} risk={risk} users={userData} />
            ))}
        </>
    );
};

interface IPropsRisk {
    className?: string;
    risk: IRisk;
    users: IUser[];
}

export const Risk: FC<IPropsRisk> = ({ risk, users }) => {
    const [deleteDialog, setDeleteDialog] = useState(false);
    let { projectId } = useParams();
    const queryClient = useQueryClient();
    const auth = useAuth();
    const [myRole, setMyRole] = useState<string | undefined>("NONE");

    const { data: categories, isLoading: categoriesLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: () => CategoryApi.getAll(),
    });

    const { isLoading } = useQuery({
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
            return RiskApi.deleteProjectRisk(pk);
        },
        onSuccess: () => {
            toast.success("Riziko bylo úspěšně smazáno");
            setDeleteDialog(false);
            queryClient.resetQueries(["project_risk", projectId]);
        },
        onError: () => {
            toast.error("Smazání rizika selhalo");
        },
    });

    const { mutate: updateRisk } = useMutation({
        mutationFn: (data: IUpdateRisk) => {
            return RiskApi.updateProjectRisk(data);
        },
        onSuccess: () => {
            toast.success("Riziko bylo úspěšně upravené");
            queryClient.resetQueries(["project_risk", projectId]);
        },
        onError: () => {
            toast.error("upravení rizika selhalo");
        },
    });

    const confirmDeleteProject = () => {
        setDeleteDialog(true);
    };

    const changeStatus = (status: string) => {
        var data = {
            status: status,
            pk: risk.pk,
        };
        updateRisk(data);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div key={risk.pk} className="project-detail-risk relative">
            <h1>{risk.fields.title}</h1>
            {(myRole === "MANAGER" || auth.user?.fields.role === "ADMIN" || (risk.fields.owner == auth.user?.pk && myRole !== "EXTERNAL")) && (
                <IcoDelete className="ml-4 cursor-pointer absolute top-4 right-4" width={"25px"} fill="red" onClick={() => confirmDeleteProject()} />
            )}
            <div className="project-detail-risk-row">
                <div className="project-detail-risk-column">
                    <h3>Vytvoril</h3>
                    {users.map((user) => {
                        if (user.pk == risk.fields.owner) {
                            return (
                                <p key={user.pk}>
                                    {user.fields.name} {user.fields.surname}
                                </p>
                            );
                        }
                    })}
                </div>
                <div className="project-detail-risk-column">
                    <h3>Pravdepodobnost</h3>
                    <p> {risk.fields.probability}</p>
                </div>
                <hr />
                <div className="project-detail-risk-column">
                    <h3>Dopad</h3>
                    <p>{risk.fields.impact}</p>
                </div>
                <div className="project-detail-risk-column">
                    <h3>Status</h3>
                    {myRole === "MANAGER" || auth.user?.fields.role == "ADMIN" ? (
                        <Form.Select aria-label="Default select example" defaultValue={risk.fields.status} onChange={(e) => changeStatus(e.target.value)}>
                            <option value="CONCEPT">CONCEPT</option>
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="CLOSED">CLOSED</option>
                        </Form.Select>
                    ) : (
                        <p>{risk.fields.status}</p>
                    )}
                </div>
            </div>
            <p key={risk.pk + "description"}>
                <b>Popis:</b> {risk.fields.description}
            </p>

            <p>
                <b>Kategoire:</b> {categories?.find((category) => category.pk === risk.fields.category)?.fields.name}
            </p>
            <hr />
            <p key={risk.pk + "danger"}>
                <b>Nebezpečenstvo:</b> {risk.fields.danger}
            </p>
            <hr />
            <p key={risk.pk + "trigger"}>
                <b>Spúštač:</b> {risk.fields.trigger}
            </p>
            <hr />
            <p key={risk.pk + "reactions"}>
                <b>Reakcia:</b> {risk.fields.reactions}
            </p>

            <ConfirmDeleteDialog
                open={deleteDialog}
                name={risk.fields.title}
                type="riziko"
                onClose={() => setDeleteDialog(false)}
                onYes={() => deleteProject(risk.pk)}
            />
        </div>
    );
};
