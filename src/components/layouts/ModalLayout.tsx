import {Context, createContext, Dispatch, SetStateAction, useMemo, useState} from "react";
import {Outlet} from "react-router";

export const ModalContext = createContext(undefined) as unknown as Context<{
    enabled: boolean;
    setEnabled: Dispatch<SetStateAction<boolean>>;
    setChildren: Dispatch<SetStateAction<JSX.Element>>;
}>

const ModalLayout = () => {
    const [enabled, setEnabled] = useState(false)
    const [children, setChildren] = useState(<></>)

    const modalState = useMemo(() => ({
        enabled, setEnabled, setChildren
    }), [enabled]);
    return (
        <>
            {enabled &&
                <div className="fixed w-dvw h-dvh bg-opacity-80 bg-gray-200 z-50 flex justify-center items-center"
                             onClick={() => setEnabled(false)}>
                <div className="bg-white border shadow p-10 rounded" onClick={(e) => e.stopPropagation()}>
                    {children}
                </div>
            </div>}
            <ModalContext.Provider value={modalState}>
                <Outlet/>
            </ModalContext.Provider>
        </>
    );
};

export default ModalLayout;