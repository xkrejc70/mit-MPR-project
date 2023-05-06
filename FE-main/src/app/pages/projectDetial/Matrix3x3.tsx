import { useQuery } from "@tanstack/react-query";
import * as htmlToImage from "html-to-image";
import { FC, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { RiskApi } from "../../../api";
import { IRisk } from "../../../types";
import "./ProjectDetail.css";

interface IProps {
    className?: string;
}

export const Matrix3x3: FC<IProps> = () => {
    let { projectId } = useParams();
    const [matrixData, setMatrixData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const domEl = useRef<HTMLDivElement>(null);

    useQuery({
        queryKey: ["project_risk", projectId],
        queryFn: () => (projectId ? RiskApi.getProjectRisk(projectId) : []),
        onError: () => {
            toast.error("Something went wrong while loading project risks");
        },
        onSuccess: (data) => {
            calculateMatrix(data);
        },
    });

    const calculateMatrix = (data: IRisk[]) => {
        let tmpArr = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        data.forEach((risk) => {
            if (risk.fields.probability === "HIGH" && risk.fields.impact === "LOW") {
                tmpArr[0]++;
            } else if (risk.fields.probability === "HIGH" && risk.fields.impact === "MEDIUM") {
                tmpArr[1]++;
            } else if (risk.fields.probability === "HIGH" && risk.fields.impact === "HIGH") {
                tmpArr[2]++;
            } else if (risk.fields.probability === "MEDIUM" && risk.fields.impact === "LOW") {
                tmpArr[3]++;
            } else if (risk.fields.probability === "MEDIUM" && risk.fields.impact === "MEDIUM") {
                tmpArr[4]++;
            } else if (risk.fields.probability === "MEDIUM" && risk.fields.impact === "HIGH") {
                tmpArr[5]++;
            } else if (risk.fields.probability === "LOW" && risk.fields.impact === "LOW") {
                tmpArr[6]++;
            } else if (risk.fields.probability === "LOW" && risk.fields.impact === "MEDIUM") {
                tmpArr[7]++;
            } else if (risk.fields.probability === "LOW" && risk.fields.impact === "HIGH") {
                tmpArr[8]++;
            }
        });
        setMatrixData(tmpArr);
    };

    const downloadImage = async () => {
        const dataUrl = await htmlToImage.toPng(domEl.current!);

        // download image
        const link = document.createElement("a");
        link.download = "matrix.png";
        link.href = dataUrl;
        link.click();
    };

    return (
        <div className="matrix">
            <h1>Matice rizik</h1>
            <div className="container" id="domEl" ref={domEl}>
                <div className="categoryTagProb">
                    <p>Pravdepodobnost</p>
                </div>
                <div className="grid3x3">
                    <div className="category" style={{ color: "grey" }}>
                        <p className="center">HIGH</p>
                    </div>
                    <div className="cell" style={{ backgroundColor: "green" }}>
                        <p className="center">{matrixData[0]}</p>
                    </div>
                    <div className="cell" style={{ backgroundColor: "yellow" }}>
                        <p className="center">{matrixData[1]}</p>
                    </div>
                    <div className="cell" style={{ backgroundColor: "red" }}>
                        <p className="center">{matrixData[2]}</p>
                    </div>
                    <div className="category" style={{ color: "grey" }}>
                        <p className="center">MEDIUM</p>
                    </div>
                    <div className="cell" style={{ backgroundColor: "green" }}>
                        <p className="center">{matrixData[3]}</p>
                    </div>
                    <div className="cell" style={{ backgroundColor: "yellow" }}>
                        <p className="center">{matrixData[4]}</p>
                    </div>
                    <div className="cell" style={{ backgroundColor: "yellow" }}>
                        <p className="center">{matrixData[5]}</p>
                    </div>
                    <div className="category" style={{ color: "grey" }}>
                        <p className="center">LOW</p>
                    </div>
                    <div className="cell" style={{ backgroundColor: "green" }}>
                        <p className="center">{matrixData[6]}</p>
                    </div>
                    <div className="cell" style={{ backgroundColor: "green" }}>
                        <p className="center">{matrixData[7]}</p>
                    </div>
                    <div className="cell" style={{ backgroundColor: "green" }}>
                        <p className="center">{matrixData[8]}</p>
                    </div>
                    <div className="category" style={{ color: "grey" }}>
                        <p className="center"></p>
                    </div>
                    <div className="category" style={{ color: "grey" }}>
                        <p className="center">LOW</p>
                    </div>
                    <div className="category" style={{ color: "grey" }}>
                        <p className="center">MEDIUM</p>
                    </div>
                    <div className="category" style={{ color: "grey" }}>
                        <p className="center">HIGH</p>
                    </div>
                </div>
                <div className="categoryTagImpact">Dopad</div>
            </div>
            <button onClick={downloadImage}>Stáhnout matici</button>
        </div>
    );
};
