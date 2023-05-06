import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./ManageRolesAdmin.css";
import { UsersTable } from "./UsersTable";

interface IProps {
    className?: string;
}

export const ManageRolesAdmin: FC<IProps> = () => {
    return (
        <div className="manageRoles">
            <h1>Spravovat uživatele</h1>
            <UsersTable />
        </div>
    );
};
