import {createPortal} from "react-dom";
import {ReactNode} from "react";
import IconButton from "./form/IconButton.tsx";
import {faX} from "@fortawesome/free-solid-svg-icons";

const Modal = ({children, enabled, setEnabled}: {
    children: ReactNode,
    enabled: boolean,
    setEnabled: (v: boolean) => void
}) => {
    return (
        <>
            {enabled &&
                createPortal(
                    <div
                        className="fixed top-0 w-dvw h-dvh  z-10 flex justify-center items-center">
                        <div className="bg-white border shadow p-10 rounded">
                            {children}
                            <div
                                className="flex flex-col items-stretch">
                                <IconButton color="danger" icon={faX}
                                            onClick={() => setEnabled(false)}
                                            extraCss="before:fixed before:top-0 before:left-0 before:w-dvw before:h-dvh before:bg-opacity-80 before:bg-gray-200 before:-z-50">Cancel</IconButton>
                            </div>
                        </div>
                    </div>,
                    document.body)}
        </>
    );
};

export default Modal;