import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import "bootstrap/dist/css/bootstrap.min.css";
import { FC, useState } from "react";
import Table from "react-bootstrap/Table";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { UserApi } from "../../../api";
import { IcoDelete } from "../../../assets/icons";
import { IUser } from "../../../types";
import { ConfirmDeleteDialog } from "../../components/ConfirmDeleteDialog";
import { useAuth } from "../../context/AuthContext";
import "./ManageRolesAdmin.css";

interface IProps {
    className?: string;
}

export const UsersTable: FC<IProps> = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const auth = useAuth();

    const [deleteUserDialog, setDeleteUserDialog] = useState(false);
    const [deletedUser, setDeletedUser] = useState<IUser | undefined>(undefined);

    if (auth.user?.fields.role !== "ADMIN") {
        navigate("/");
    }

    const { data: users, isLoading } = useQuery({
        queryKey: ["users"],
        queryFn: () => UserApi.getAll(),
    });

    const { mutate: deleteUser } = useMutation({
        mutationFn: () => {
            return deletedUser ? UserApi.deleteUser(deletedUser.pk) : ({} as Promise<any>);
        },
        onSuccess: () => {
            toast.success("Uřivatel byl úspěšně smazán");
            setDeleteUserDialog(false);
            setDeletedUser(undefined);
            queryClient.resetQueries(["users"]);
        },
        onError: () => {
            toast.error("Smazání uživatele selhalo");
        },
    });

    const { mutate: changeRole } = useMutation({
        mutationFn: (data: { user: IUser; newRole: string }) => {
            const newUser = { ...data.user, fields: { ...data.user.fields, role: data.newRole } };
            return UserApi.update(newUser.fields, newUser.pk);
        },
        onSuccess: () => {
            toast.success("Uřivatel byl úspěšně aktualizován");
            queryClient.resetQueries(["users"]);
        },
        onError: () => {
            toast.error("Aktualizace uživatele selhala");
        },
    });

    const confirmDeleteUser = () => {
        deleteUser();
    };

    const showDeleteUserDialog = (user: IUser) => {
        setDeletedUser(user);
        setDeleteUserDialog(true);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!users) {
        return <div>Not Found</div>;
    }

    return (
        <>
            <Table striped bordered hover className="myTable">
                <thead>
                    <tr>
                        <th>Jméno</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Smazat</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user: IUser) => {
                        return (
                            <tr key={user.pk}>
                                <td>
                                    {user.fields.name} {user.fields.surname}
                                </td>
                                <td>{user.fields.email}</td>
                                <td>
                                    <RadioGroup row className="radio" value={user.fields.role} onChange={(e) => changeRole({ user, newRole: e.target.value })}>
                                        <FormControlLabel value={"ADMIN"} control={<Radio />} label="Administrátor" />
                                        <FormControlLabel
                                            value={"PROJECT_MANAGER"}
                                            control={<Radio />}
                                            label="Projektový manažér"
                                            disabled={user.pk === auth.user?.pk}
                                        />
                                        <FormControlLabel value={"USER"} control={<Radio />} label="Uživatel" disabled={user.pk === auth.user?.pk} />
                                    </RadioGroup>
                                </td>
                                <td width={80}>
                                    {user.pk !== auth.user?.pk && (
                                        <IcoDelete
                                            className="ml-4 cursor-pointer  mx-auto mt-1"
                                            width={"30px"}
                                            fill="red"
                                            onClick={() => showDeleteUserDialog(user)}
                                        />
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>

            <ConfirmDeleteDialog
                open={deleteUserDialog}
                name={deletedUser?.fields.name}
                type="uživatele"
                onClose={() => setDeleteUserDialog(false)}
                onYes={() => confirmDeleteUser()}
            />
        </>
    );
};
