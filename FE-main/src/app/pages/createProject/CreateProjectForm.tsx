import { FormControlLabel } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { useMutation } from "@tanstack/react-query";
import { Formik } from "formik";
import { FC } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { object, string } from "yup";
import { ProjectApi } from "../../../api";
import { ICreateProject } from "../../../types";
import { RiskInputFormik } from "../../components/RiskInput";
import "./CreateProject.css";

interface IProps {
    className?: string;
}

export const CreateProjectForm: FC<IProps> = () => {
    const navigate = useNavigate();

    const { mutate: createProject } = useMutation({
        mutationFn: (data: ICreateProject) => {
            return ProjectApi.createProject(data);
        },
        onSuccess: () => {
            toast.success("Projekt byl úspěšně vytvořen.");
            navigate("/");
        },
        onError: () => {
            toast.error("Vytváření projektu selhalo.");
        },
    });

    const initialValues = {
        name: "",
        description: "",
        scale: false,
        startDate: new Date(),
        endDate: new Date(Date.now() + 3600 * 1000 * 24),
    };

    const loginFormValidationSchema = object().shape({
        name: string().required("Toto pole je povinné"),
        description: string().required("Toto pole je povinné"),
    });

    // TODO -> functionality of button after creating new project (submitting form)
    const createFormProject = (data: ICreateProject) => {
        createProject(data);
    };

    return (
        <>
            <Formik onSubmit={createFormProject} validationSchema={loginFormValidationSchema} initialValues={initialValues}>
                {({ handleSubmit, handleChange, values, setFieldValue, errors, touched }) => (
                    <form onSubmit={handleSubmit}>
                        <RiskInputFormik
                            className="my-6 text-#1d3746 w-100"
                            label="Název projektu"
                            name={"name"}
                            type={"text"}
                            placeholder={"Názov"}
                            required
                        />
                        <RiskInputFormik
                            className="my-6 text-#1d3746 w-100"
                            label="Popis projektu"
                            name={"description"}
                            type={"text"}
                            placeholder={"Popis"}
                            required
                        />

                        <div className="row">
                            <div className="column">
                                <div>Začátek projektu:</div>
                                <DatePicker
                                    className="calendar"
                                    selected={values.startDate}
                                    onChange={(val) => {
                                        setFieldValue("startDate", val);
                                    }}
                                />
                            </div>
                            <div className="column">
                                <div>Konec projektu:</div>
                                <DatePicker
                                    className="calendar"
                                    selected={values.endDate}
                                    onChange={(val) => {
                                        setFieldValue("endDate", val);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="scales">
                            Zmenšený rozsah škál:
                            <FormControlLabel control={<Checkbox checked={values.scale} />} label="" name="scale" onChange={handleChange} className="check" />
                        </div>
                        <button type="submit">Vytvořit projekt</button>
                    </form>
                )}
            </Formik>
        </>
    );
};
