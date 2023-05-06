import { FC } from "react";
import { toast, ToastBar, Toaster } from "react-hot-toast";
import { IcoCheck, IcoExclamation } from "../../assets/icons";

export const NotificationCenter: FC = () => {
    return (
        <Toaster position="top-center" toastOptions={{ error: { duration: 5000 }, success: { duration: 3000 } }}>
            {(tst) => (
                <ToastBar toast={tst} style={{ padding: "0 0 0 0", borderRadius: "1rem", minWidth: "65vw" }}>
                    {({ message }) => {
                        let toastMessage = (message as JSX.Element).props.children;
                        let headerMessage = "";

                        if (tst.type === "success" || tst.type === "error") {
                            if (toastMessage && toastMessage.toString().split("|").length === 2) {
                                headerMessage = toastMessage.toString().split("|")[0];
                                toastMessage = toastMessage.toString().split("|")[1];
                            } else {
                                headerMessage = "";
                            }
                        }

                        return (
                            <div className="flex bg-[#4b4d52]/90 rounded-[1rem] shadow-xl w-full">
                                <div className="grow-0 flex justify-center items-center px-6">
                                    <div
                                        className={`h-10 w-10 rounded-full border-2 ${
                                            tst.type === "success" ? "border-green" : "border-red"
                                        } flex justify-center items-center`}
                                    >
                                        {tst.type === "success" && <IcoCheck className="fill-green w-2/3" />}
                                        {tst.type === "error" && <IcoExclamation className="fill-red h-2/3" />}
                                    </div>
                                </div>

                                <div className="grow my-4 mr-4">
                                    <p className="text-lg font-medium text-white">{headerMessage}</p>
                                    <p className="text-[1rem] text-[#d7d7de]">{toastMessage}</p>
                                </div>

                                <div className="grow-0 shrink-0 flex w-20 border-l border-[#a0a0a7] flex-col justify-center">
                                    <button
                                        onClick={() => toast.dismiss(tst.id)}
                                        className="w-full border border-transparent rounded-none rounded-r-lg px-6 py-3 flex items-center justify-center text-sm font-medium text-[#d7d7de]"
                                    >
                                        {"Close"}
                                    </button>
                                    {/* { t.type === 'error' && <button onClick={() => toast.dismiss(t.id)} className="w-full border border-transparent rounded-none rounded-r-lg border-t border-t-gray-200 px-6 py-3 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"> Report </button> } */}
                                </div>
                            </div>
                        );
                    }}
                </ToastBar>
            )}
        </Toaster>
    );
};
