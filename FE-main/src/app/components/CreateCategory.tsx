import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Formik } from "formik";
import { FC, useEffect } from "react";
import { toast } from "react-hot-toast";
import { object, string } from "yup";
import { CategoryApi } from "../../api";
import { ICreateCategory } from "../../types";
import { RiskInputFormik } from "./RiskInput";

interface IProps {
    className?: string;
    show: boolean;
    setShow: (value: boolean) => void;
}

export const CreateCategory: FC<IProps> = ({ show = false, setShow }) => {
    const queryClient = useQueryClient();

    useEffect(() => {
        setShow(show);
    }, [show]);

    const { mutate: createCategory } = useMutation({
        mutationFn: (data: ICreateCategory) => {
            return CategoryApi.create(data);
        },
        onSuccess: (resp) => {
            toast.success("Category created");
            queryClient.resetQueries(["categories"]);
            setShow(false);
        },
        onError: () => {
            toast.error("Creating category failed");
        },
    });

    const initialValues = {
        name: "",
        description: "",
    };

    const categoryFormValidationSchema = object().shape({
        name: string().required("Toto pole je povinné"),
        description: string().required("Toto pole je povinné"),
    });

    const createFormCategory = (data: ICreateCategory) => {
        createCategory(data);
    };

    if (!show) return null;

    return (
        <div className="h-[100vh] w-[100vw] bg-transparent-300 absolute left-0 top-0 grid content-center justify-center">
            <div className="h-[70vh] w-[50vw] bg-mine-shaft-50 p-10 rounded-lg relative">
                <h1>Vytvořit novou kategorii</h1>
                <span onClick={() => setShow(false)} className="absolute top-2 right-4 text-3xl font-bold cursor-pointer">
                    X
                </span>
                <Formik onSubmit={createFormCategory} validationSchema={categoryFormValidationSchema} initialValues={initialValues}>
                    {({ handleSubmit, values, setFieldValue }) => (
                        <form onSubmit={handleSubmit}>
                            <RiskInputFormik
                                className="my-6 text-#1d3746 w-100"
                                label="Název kategorie"
                                name={"name"}
                                type={"text"}
                                placeholder={"Názov"}
                                required
                            />
                            <RiskInputFormik
                                className="my-6 text-#1d3746 w-100"
                                label="Popis kategorie"
                                name={"description"}
                                type={"text"}
                                placeholder={"Popis"}
                                required
                            />
                            <button type="submit">Vytvořit kategorii</button>
                        </form>
                    )}
                </Formik>
            </div>
        </div>
    );
};
