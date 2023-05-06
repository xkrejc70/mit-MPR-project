import { Dialog, Transition } from "@headlessui/react";
import { Children, FC, Fragment, ReactNode, cloneElement } from "react";
import { IcoTimes } from "../../assets/icons";

const OVERLAY_TRANSITION_PROPS = {
    enter: "ease-out duration-300",
    enterFrom: "opacity-0",
    enterTo: "opacity-100",
    leave: "ease-in duration-200",
    leaveFrom: "opacity-100",
    leaveTo: "opacity-0",
};

const DIALOG_TRANSITION_PROPS = {
    enter: "ease-out duration-300",
    enterFrom: "opacity-0 scale-95",
    enterTo: "opacity-100 scale-100",
    leave: "ease-in duration-200",
    leaveFrom: "opacity-100 scale-100",
    leaveTo: "opacity-0 scale-95",
};

interface IProps {
    isOpen: boolean;
    closeDialog: () => void;
    className?: string;
    children: JSX.Element | JSX.Element[];
}

const KanbanDialogRoot: FC<IProps> = ({ isOpen, closeDialog, className, children }) => {
    const ac = Children.toArray(children) as JSX.Element[];
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-20 overflow-y-auto" onClose={closeDialog}>
                <div className="h-screen flex justify-center items-center">
                    <Transition.Child {...OVERLAY_TRANSITION_PROPS}>
                        <Dialog.Overlay className="fixed inset-0 bg-[#2d2d2d] opacity-90" />
                    </Transition.Child>
                    <Transition.Child
                        {...DIALOG_TRANSITION_PROPS}
                        className={`relative bg-white rounded-xl overflow-hidden flex flex-col ${className ? className : ""}`}
                    >
                        {ac[0] && ac[0].type?.name === "Header" ? cloneElement(ac[0], { onClose: closeDialog }) : ac[0]}
                        {Children.map(
                            ac.filter((_, index) => index > 0),
                            (child) => child
                        )}
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

interface IDialogHeaderProps {
    onClose?: () => void;
    children: JSX.Element | JSX.Element[];
}

const Header: FC<IDialogHeaderProps> = ({ children, onClose }) => {
    const arrayChildren = Children.toArray(children) as JSX.Element[];
    return (
        <div className="w-full bg-mid-gray basis-32 shrink-0 grow-0 flex items-center px-9">
            <div className="basis-full">{Children.map(arrayChildren, (child) => child)}</div>
            <div className="basis-14 aspect-square bg-[#A2A2AD] rounded-lg center-container" onClick={() => onClose && onClose()}>
                <IcoTimes className="fill-white h-3/4 mx-auto mt-2" />
            </div>
        </div>
    );
};

const Title: FC<{ children: ReactNode; className?: string }> = ({ children, className }) => {
    const ac = Children.toArray(children) as JSX.Element[];
    return <h1 className={`text-[1.75rem] text-white font-semibold leading-none ${className || ""}`}>{Children.map(ac, (child) => child)}</h1>;
};

const Subtitle: FC<{ children: ReactNode; className?: string }> = ({ children, className }) => {
    const ac = Children.toArray(children) as JSX.Element[];
    return <h2 className={`text-[1.35rem] text-white ${className || ""}`}>{Children.map(ac, (child) => child)}</h2>;
};

const Content: FC<{ children?: ReactNode; className?: string }> = ({ children, className }) => {
    const ac = Children.toArray(children) as JSX.Element[];
    return <div className={`basis-full grow p-5 ${className || ""}`}>{Children.map(ac, (child) => child)}</div>;
};

export const KanbanDialog = Object.assign(KanbanDialogRoot, { Header, Title, Subtitle, Content });
