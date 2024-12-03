import {Link, To} from "react-router";
import IconButton from "../form/IconButton.tsx";
import {faPencil, faX} from "@fortawesome/free-solid-svg-icons";
import {ReactNode} from "react";

const Card = (({onEdit, onDelete, children, linkTo, extraButton}: {
    onEdit: () => void,
    onDelete: () => void,
    linkTo: To,
    children: ReactNode,
    extraButton?: ReactNode
}) => {
    return (
        <div
            className="w-full flex flex-col md:flex-row shadow rounded border py-3 px-3 md:px-10 items-center
              hover:shadow-xl transition-shadow">
            <Link className="w-10/12 flex flex-col md:flex-row cursor-pointer" to={linkTo}>
                {children}
            </Link>
            <div className="md:w-4/12 lg:w-3/12 xl:w-2/12 flex *:flex-grow gap-2">
                {extraButton}
                <IconButton icon={faPencil} onClick={onEdit}>{"Edit"}</IconButton>
                <IconButton icon={faX} color="danger" onClick={onDelete}>{"Delete"}</IconButton>
            </div>
        </div>
    );
});

export default Card;