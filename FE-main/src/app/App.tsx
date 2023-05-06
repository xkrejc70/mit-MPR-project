import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FC, useEffect } from "react";
import { IcoLoader } from "../assets/icons";
import "./App.css";
import { NotificationCenter } from "./components/NotificationCenter";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CreateProject, CreateRisk, Dashboard, Login, MainLayout, ManageRolesAdmin, ProjectDetail, ProjectTeam } from "./pages";
import { Risks } from "./pages/risks/Risks";

const queryClient = new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false } } });

const PrivatePlantRoute: FC = () => {
    const { authenticate, authState } = useAuth();

    useEffect(() => {
        if (authState !== "idle") return;
        authenticate();
    }, [authenticate, authState]);

    if (authState === "fail") return <Navigate to="/login" />;
    if (authState === "inProgress") return <IcoLoader className={"m-auto animate-spin w-10 fill-gray-500"} />;

    return <MainLayout />;
};

// TODO -> route createproject should be visible only for project manager (admin ?) not for regular customer ... need to be done
// TODO -> route managerolesadmin should be visible only for admin
export default function App() {
    return (
        <div className="App">
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <>
                        <NotificationCenter />
                        <Router>
                            <Routes>
                                <Route path="/login" element={<Login />} />
                                <Route path="*" element={<PrivatePlantRoute />}>
                                    <Route path="project/:projectId" element={<ProjectDetail />} />
                                    <Route path="createproject" element={<CreateProject />} />
                                    <Route path="project/:projectId/createrisk" element={<CreateRisk />} />
                                    <Route path="managerolesadmin" element={<ManageRolesAdmin />} />
                                    <Route path="risks" element={<Risks />} />
                                    <Route path="project/:projectId/projectteam" element={<ProjectTeam />} />
                                    <Route path="*" element={<Dashboard />} />
                                </Route>
                            </Routes>
                        </Router>
                    </>
                </AuthProvider>
            </QueryClientProvider>
        </div>
    );
}
