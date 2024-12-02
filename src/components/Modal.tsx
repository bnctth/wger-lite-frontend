import {createPortal} from "react-dom";
import {ReactNode} from "react";

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
                        className="fixed top-0 w-dvw h-dvh bg-opacity-80 bg-gray-200 z-50 flex justify-center items-center"
                        onClick={() => setEnabled(false)} tabIndex={-1}>
                        <div className="bg-white border shadow p-10 rounded" onClick={(e) => e.stopPropagation()}
                             tabIndex={-1}>
                            {children}
                        </div>
                    </div>,
                    document.body)}
        </>
    );
};

export default Modal;