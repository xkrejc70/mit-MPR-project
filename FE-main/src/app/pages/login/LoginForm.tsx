import { Formik } from "formik";
import { FC } from "react";
import { Navigate } from "react-router-dom";
import { object, string } from "yup";
import { IUserLogin } from "../../../types";
import { RiskInputFormik } from "../../components/RiskInput";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

interface IProps {
    className?: string;
}

export const LoginForm: FC<IProps> = () => {
    const auth = useAuth();
    const initialValues = {
        login: "admin@mpr.cz",
        password: "Password1",
    };

    const loginFormValidationSchema = object().shape({
        login: string().required("This field is required"),
        password: string().required("This field is required"),
    });

    const logIn = (data: IUserLogin) => {
        auth.logIn({ login: data.login, password: data.password });
    };

    if (auth.authState === "success" && auth.user) return <Navigate to={"/"} />;

    return (
        <Formik onSubmit={logIn} validationSchema={loginFormValidationSchema} initialValues={initialValues}>
            {({ handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                    <h2 className="text-2xl text-white font-semibold">Přihlášení</h2>
                    <RiskInputFormik
                        className="my-6 text-white w-64"
                        label="Vaše e-mailová adresa"
                        name={"login"}
                        type={"text"}
                        placeholder={"Email"}
                        required
                    />
                    <RiskInputFormik
                        className="my-6 text-white w-64"
                        label="Vaše heslo"
                        name={"password"}
                        type={"password"}
                        placeholder={"Password"}
                        required
                    />
                    <button className="bg-red py-2 px-4 rounded-md float-right text-white" type="submit">
                        Login
                    </button>
                </form>
            )}
        </Formik>
    );
};
