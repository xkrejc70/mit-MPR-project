import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import "bootstrap/dist/css/bootstrap.min.css";
import { FC, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { ProjectApi, UserApi } from "../../../api";
import { IcoDelete } from "../../../assets/icons";
import { useAuth } from "../../context/AuthContext";
import "./ProjectTeam.css";

interface IProps {
    className?: string;
}

export const TeamUsersTable: FC<IProps> = () => {
    const { projectId } = useParams();
    const auth = useAuth();
    const queryClient = useQueryClient();

    const [selectedUser, setSelectedUser] = useState(-1);
    const [selectedRole, setSelectedRole] = useState("NONE");

    const [myRole, setMyRole] = useState<string | undefined>("NONE");

    const { data: users } = useQuery({
        queryKey: ["users"],
        queryFn: () => (projectId ? UserApi.getAll() : []),
        onError: () => {
            toast.error("Nepodařilo se načíst uživatele.");
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

    const { mutate: addProjectUser } = useMutation({
        mutationFn: (data: { user: number; project: string; role: string }) => {
            return ProjectApi.createProjectUser(data);
        },
        onSuccess: () => {
            toast.success("Uživatel byl úspěšně přidán.");
            setSelectedUser(-1);
            setSelectedRole("NONE");
            queryClient.resetQueries(["projectUsers"]);
        },
        onError: () => {
            toast.error("Přidání uživatele selhalo.");
        },
    });

    const { mutate: deleteProjectUser } = useMutation({
        mutationFn: (id: number) => {
            return ProjectApi.deleteProjectUser(id);
        },
        onSuccess: () => {
            toast.success("Uživatel byl úspěšně smazán.");
            queryClient.resetQueries(["projectUsers"]);
        },
        onError: () => {
            toast.error("Smazání uživatele selhalo.");
        },
    });

    const addUser = () => {
        if (selectedUser === -1) {
            toast.error("Nebyl vybrán žádný uživatel.");
            return;
        }
        if (selectedRole === "NONE") {
            toast.error("Nebyla vybrána žádná role.");
            return;
        }
        if (projectId !== undefined) addProjectUser({ user: selectedUser, project: projectId, role: selectedRole });
    };

    return (
        <div>
            <Table striped bordered className="myTable">
                <thead>
                    <tr>
                        <th>Jméno</th>
                        <th>Příjmení</th>
                        <th>Role</th>
                        <th>Vymazat</th>
                    </tr>
                </thead>
                <tbody>
                    {projectUsers?.map((teamUser) => {
                        const user = users?.find((user) => user.pk == teamUser.fields.user);
                        console.log(user);
                        console.log(users);
                        return (
                            <tr key={teamUser.pk}>
                                <td>{user?.fields.name}</td>
                                <td>{user?.fields.surname}</td>
                                <td>
                                    {teamUser.fields.role === "MANAGER" && "Manažer"}
                                    {teamUser.fields.role === "EXTERNAL" && "Externí uživatel"}
                                    {teamUser.fields.role === "EMPLOYEE" && "Zaměstnanec"}
                                </td>
                                <td width={80}>
                                    {(teamUser.fields.user !== auth.user?.pk || auth.user?.fields.role == "ADMIN") &&
                                        (myRole == "MANAGER" || auth.user?.fields.role == "ADMIN") && (
                                            <IcoDelete
                                                className="ml-4 cursor-pointer  mx-auto mt-1"
                                                width={"30px"}
                                                fill="red"
                                                onClick={() => deleteProjectUser(teamUser.pk)}
                                            />
                                        )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
            {(myRole == "MANAGER" || auth.user?.fields.role == "ADMIN") && (
                <div>
                    <h3>Přidat člena do tímu</h3>
                    <div className="flex flex-row my-2">
                        <div className="items-center  basis-1/6 mr-2">Uživatel</div>
                        <div className="items-center basis-5/6">
                            <Form.Select
                                aria-label="Default select example"
                                className="customSelect m-0"
                                onChange={(e) => setSelectedUser(e.target.value as unknown as number)}
                                value={selectedUser}
                            >
                                <option value={-1} disabled></option>
                                {users?.map((user, index) => {
                                    if (projectUsers?.find((projectUser) => projectUser.fields.user === user.pk)) return null;
                                    return (
                                        <option key={index} value={user.pk}>
                                            {user.fields.name} {user.fields.surname} ({user.fields.role})
                                        </option>
                                    );
                                })}
                            </Form.Select>
                        </div>
                    </div>

                    <div className="flex flex-row my-2">
                        <div className="items-center basis-1/6 mr-2">Role</div>
                        <div className="items-center basis-5/6">
                            <Form.Select
                                aria-label="Default select example"
                                className="customSelect m-0"
                                onChange={(e) => setSelectedRole(e.target.value)}
                                value={selectedRole}
                            >
                                <option className="h-0" value={"NONE"} disabled></option>
                                <option value={"MANAGER"}>Manažér</option>
                                <option value={"EXTERNAL"}>Externý uživatel</option>
                                <option value={"EMPLOYEE"}>Zaměstnanec</option>
                            </Form.Select>
                        </div>
                    </div>
                    <Button onClick={addUser}>Přidat</Button>
                </div>
            )}
        </div>
    );
};
