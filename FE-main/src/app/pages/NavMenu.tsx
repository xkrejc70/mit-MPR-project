import { useQuery } from "@tanstack/react-query";
import { FC, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ProjectApi } from "../../api";
import { IProject } from "../../types";
import { useAuth } from "../context/AuthContext";

interface IProps {
    className?: string;
}

const logo = require("./../../assets/images/logo.png");

export const NavMenu: FC<IProps> = (className) => {
    const auth = useAuth();
    const navigate = useNavigate();
    const [projects, setProjects] = useState<IProject[]>([]);

    const { isLoading } = useQuery({
        queryKey: ["projects"],
        queryFn: () => ProjectApi.getAll(),
        onSuccess: (data) => {
            const myProjects: IProject[] = [];
            data.forEach((project) => {
                if (project.fields.owner_id === auth.user?.pk) myProjects.push(project);
            });
            setProjects(myProjects);
        },
    });

    return (
        <div className={`flex flex-col items-stretch nav-menu-grad overflow-auto relative ${className || ""}`}>
            <div className={`bg-mine-shaft h-32 w-full flex justify-center align-center shrink-0 sticky top-0`}>
                <img onClick={() => navigate("/")} src={logo} className={"w-4/6 object-contain cursor-pointer"} alt={"logo"} />
            </div>
            <div className="bg-mine-shaft-400 p-2">
                <div className="text-white text-center">
                    Uživatel: {auth.user?.fields.name} {auth.user?.fields.surname}
                    <br />
                    Role: {auth.user?.fields.role}
                </div>
                <button onClick={() => navigate("/")} className="border-2 bg-white w-full h-10 rounded-lg my-1 mt-4">
                    Domů
                </button>
                <button onClick={() => navigate("/risks")} className="border-2 bg-white w-full h-10 rounded-lg  my-1">
                    Seznam rizik
                </button>
                {auth.user?.fields.role !== "USER" && (
                    <button onClick={() => navigate("/createproject")} className="border-2 bg-white w-full h-10 rounded-lg  my-1">
                        Nový projekt
                    </button>
                )}
                {auth.user?.fields.role == "ADMIN" ? (
                    <button onClick={() => navigate("/managerolesadmin")} className="border-2 bg-white w-full h-10 rounded-lg  my-1">
                        Spravovat lidi
                    </button>
                ) : null}
            </div>
            <div className="bg-mine-shaft-400 h-full text-white p-4">
                {projects.length !== 0 && <h2>Moje projekty</h2>}
                {isLoading && <p>Loading...</p>}
                {!isLoading && (
                    <ul>
                        {projects.map((project) => (
                            <li key={project.pk}>
                                <NavLink to={"/project/" + project.pk}>{project.fields.name}</NavLink>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <button className="bg-red h-16  " onClick={() => auth.logOut()}>
                Log out
            </button>
        </div>
    );
};
