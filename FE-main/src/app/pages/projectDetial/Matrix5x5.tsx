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

export const Matrix5x5: FC<IProps> = () => {
    let { projectId } = useParams();
    const [matrixData, setMatrixData] = useState<number[]>(new Array(25).fill(0));
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
        let tmpArr = new Array(25).fill(0);
        data.forEach((risk) => {
            if (risk.fields.probability === "EXTREME" && risk.fields.impact === "TINY") {
                tmpArr[0]++;
            } else if (risk.fields.probability === "EXTREME" && risk.fields.impact === "LOW") {
                tmpArr[1]++;
            } else if (risk.fields.probability === "EXTREME" && risk.fields.impact === "MEDIUM") {
                tmpArr[2]++;
            } else if (risk.fields.probability === "EXTREME" && risk.fields.impact === "HIGH") {
                tmpArr[3]++;
            } else if (risk.fields.probability === "EXTREME" && risk.fields.impact === "EXTREME") {
                tmpArr[4]++;
            } else if (risk.fields.probability === "HIGH" && risk.fields.impact === "TINY") {
                tmpArr[5]++;
            } else if (risk.fields.probability === "HIGH" && risk.fields.impact === "LOW") {
                tmpArr[6]++;
            } else if (risk.fields.probability === "HIGH" && risk.fields.impact === "MEDIUM") {
                tmpArr[7]++;
            } else if (risk.fields.probability === "HIGH" && risk.fields.impact === "HIGH") {
                tmpArr[8]++;
            } else if (risk.fields.probability === "HIGH" && risk.fields.impact === "EXTREME") {
                tmpArr[9]++;
            } else if (risk.fields.probability === "MEDIUM" && risk.fields.impact === "TINY") {
                tmpArr[10]++;
            } else if (risk.fields.probability === "MEDIUM" && risk.fields.impact === "LOW") {
                tmpArr[11]++;
            } else if (risk.fields.probability === "MEDIUM" && risk.fields.impact === "MEDIUM") {
                tmpArr[12]++;
            } else if (risk.fields.probability === "MEDIUM" && risk.fields.impact === "HIGH") {
                tmpArr[13]++;
            } else if (risk.fields.probability === "MEDIUM" && risk.fields.impact === "EXTREME") {
                tmpArr[14]++;
            } else if (risk.fields.probability === "LOW" && risk.fields.impact === "TINY") {
                tmpArr[15]++;
            } else if (risk.fields.probability === "LOW" && risk.fields.impact === "LOW") {
                tmpArr[16]++;
            } else if (risk.fields.probability === "LOW" && risk.fields.impact === "MEDIUM") {
                tmpArr[17]++;
            } else if (risk.fields.probability === "LOW" && risk.fields.impact === "HIGH") {
                tmpArr[18]++;
            } else if (risk.fields.probability === "LOW" && risk.fields.impact === "EXTREME") {
                tmpArr[19]++;
            } else if (risk.fields.probability === "TINY" && risk.fields.impact === "TINY") {
                tmpArr[20]++;
            } else if (risk.fields.probability === "TINY" && risk.fields.impact === "LOW") {
                tmpArr[21]++;
            } else if (risk.fields.probability === "TINY" && risk.fields.impact === "MEDIUM") {
                tmpArr[22]++;
            } else if (risk.fields.probability === "TINY" && risk.fields.impact === "HIGH") {
                tmpArr[23]++;
            } else if (risk.fields.probability === "TINY" && risk.fields.impact === "EXTREME") {
                tmpArr[24]++;
            }
            setMatrixData(tmpArr);
        });
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
                <div className="categoryTagProb" style={{ top: "130px" }}>
                    <p>Pravdepodobnost</p>
                </div>
                <div className="grid5x5">
                    <div className="category" style={{ color: "grey" }}>
                        <p className="center">EXTREME</p>
                    </div>
                    <div className="cell" style={{ backgroundColor: "yellow" }}>
                        <p className="center">{matrixData[0]}</p>
                    </div>
                    <div className="cell" style={{ backgroundColor: "orange" }}>
                        <p className="center">{matrixData[1]}</p>
                    </div>
                    <div className="cell" style={{ backgroundColor: "red" }}>
                        <p className="center">{matrixData[2]}</p>
                    </div>
                    <div className="cell" style={{ backgroundColor: "red" }}>
                        <p className="center">{matrixData[3]}</p>
                    </div>
                    <div className="cell" style={{ backgroundColor: "red" }}>
                        <p className="center">{matrixData[4]}</p>
                    </div>
                    <div className="category" style={{ color: "grey" }}>
                        <p className="center">HIGH</p>
                    </div>
                    <div className="cell" style={{ backgroundColor: "yellow" }}>
                        <p className="center">{matrixData[5]}</p>
                    </div>
                    <div className="cell" style={{ backgroundColor: "orange" }}>
                        <p className="center">{matrixData[6]}</p>
                    </div>
                    <div className="cell" style={{ backgroundColor: "orange" }}>
                        <p className="center">{matrixData[7]}</p>
                    </div>
                    <div className="cell" style={{ backgroundColor: "red" }}>
                        <p className="center">{matrixData[8]}</p>
                    </div>
                    <div className="cell" style={{ backgroundColor: "red" }}>
                        <p className="center">{matrixData[9]}</p>
                    </div>
                    <div className="category" style={{ color: "grey" }}>
                        <p className="center">MEDIUM</p>
                    </div>
                    <div className="cell" style={{ backgroundColor: "green" }}>
                        <p className="center">{matrixData[10]}</p>
                    </div>
                    <div className="cell" style={{ backgroundColor: "yellow" }}>
                        <p className="center">{matrixData[11]}</p>
                    </div>
                    <div className="cell" style={{ backgroundColor: "orange" }}>
                        <p className="center">{matrixData[12]}</p>
                    </div>
                    <div className="cell" style={{ backgroundColor: "orange" }}>
                        <p className="center">{matrixData[13]}</p>
                    </div>
                    <div className="cell" style={{ backgroundColor: "red" }}>
                        <p className="center">{matrixData[14]}</p>
                    </div>
                    <div className="category" style={{ color: "grey" }}>
                        <p className="center">LOW</p>
                    </div>
                    <div className="cell" style={{ backgroundColor: "green" }}>
                        <p className="center">{matrixData[15]}</p>
                    </div>
                    <div className="cell" style={{ backgroundColor: "yellow" }}>
                        <p className="center">{matrixData[16]}</p>
                    </div>
                    <div className="cell" style={{ backgroundColor: "yellow" }}>
                        <p className="center">{matrixData[17]}</p>
                    </div>
                    <div className="cell" style={{ backgroundColor: "orange" }}>
                        <p className="center">{matrixData[18]}</p>
                    </div>
                    <div className="cell" style={{ backgroundColor: "orange" }}>
                        <p className="center">{matrixData[19]}</p>
                    </div>
                    <div className="category" style={{ color: "grey" }}>
                        <p className="center">TINY</p>
                    </div>
                    <div className="cell" style={{ backgroundColor: "green" }}>
                        <p className="center">{matrixData[20]}</p>
                    </div>
                    <div className="cell" style={{ backgroundColor: "green" }}>
                        <p className="center">{matrixData[21]}</p>
                    </div>
                    <div className="cell" style={{ backgroundColor: "green" }}>
                        <p className="center">{matrixData[22]}</p>
                    </div>
                    <div className="cell" style={{ backgroundColor: "yellow" }}>
                        <p className="center">{matrixData[23]}</p>
                    </div>
                    <div className="cell" style={{ backgroundColor: "yellow" }}>
                        <p className="center">{matrixData[24]}</p>
                    </div>
                    <div className="category" style={{ color: "grey" }}>
                        <p className="center"></p>
                    </div>
                    <div className="category" style={{ color: "grey" }}>
                        <p className="center">TINY</p>
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
                    <div className="category" style={{ color: "grey" }}>
                        <p className="center">EXTREME</p>
                    </div>
                </div>
                <div className="categoryTagImpact">Dopad</div>
            </div>
            <button onClick={downloadImage}>Stáhnout matici</button>
        </div>
    );
};
