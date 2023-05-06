import { useQuery } from "@tanstack/react-query";
import { FC, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import toast from "react-hot-toast";
import { FaFilter } from "react-icons/fa";
import { CategoryApi, RiskApi, UserApi } from "../../../api";
import { IRisk } from "../../../types";
import "../projectDetial/ProjectDetail.css";

interface IProps {
    className?: string;
}

export const Risks: FC<IProps> = () => {
    const [name, setName] = useState("");
    const [filteredRisks, setFilteredRisks] = useState<IRisk[]>([]);

    useEffect(() => {
        filtering();
    }, [name]);

    const { data: categories, isLoading: categoriesLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: () => CategoryApi.getAll(),
    });

    const { data: risks, isLoading } = useQuery({
        queryKey: ["risks"],
        queryFn: () => RiskApi.getAll(),
        onError: () => {
            toast.error("Při načítání rizik došlo k chybě");
        },
        onSuccess: (data) => {
            setFilteredRisks(data);
        },
    });

    const { data: userData, isLoading: userLoading } = useQuery({
        queryKey: ["users"],
        queryFn: () => UserApi.getAll(),
        onError: () => {
            toast.error("Něco se pokazilo při načítání uživatelů");
        },
    });

    function filtering() {
        let tmpArray: IRisk[] = [];
        risks?.map((risk) => {
            if (risk.fields.title.toLowerCase().includes(name.toLowerCase())) {
                tmpArray.push(risk);
            }
        });
        setFilteredRisks(tmpArray);
    }

    return (
        <div className="projectTeam ">
            <h1>Seznam rizik</h1>

            <div className="filter">
                <div style={{ float: "left" }}>
                    <FaFilter size={30} className="mr-2 mt-1" />
                </div>
                <div style={{ float: "left" }}>
                    <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Filtrovat rizika" />
                </div>
            </div>
            {risks &&
                userData &&
                !isLoading &&
                filteredRisks.map((risk) => (
                    <div key={risk.pk} className="project-detail-risk relative border-mine-shaft-200 border-2">
                        <h1>{risk.fields.title}</h1>
                        <div className="project-detail-risk-row">
                            <div className="project-detail-risk-column">
                                <h3>Vytvoril</h3>
                                {userData.map((user) => {
                                    if (user.pk == risk.fields.owner) {
                                        return (
                                            <p>
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
                                <p>{risk.fields.status}</p>
                            </div>
                        </div>
                        <p>
                            <b>Popis:</b> {risk.fields.description}
                        </p>
                        <p>
                            <b>Kategoire:</b> {categories?.find((category) => category.pk === risk.fields.category)?.fields.name}
                        </p>
                    </div>
                ))}
        </div>
    );
};
