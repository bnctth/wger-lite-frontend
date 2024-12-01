import {WorkoutDto} from "../../services/Dtos.ts";
import {Link} from "react-router";
import {memo} from "react";
import IconButton from "../form/IconButton.tsx";
import {faPencil, faX} from "@fortawesome/free-solid-svg-icons";

const WorkoutCard = memo(({workout, onEdit, onDelete}: {
    workout: WorkoutDto,
    onEdit: () => void,
    onDelete: () => void
}) => {
    return (
        <div
            className="w-full flex flex-col md:flex-row shadow rounded border py-3 px-3 md:px-10 items-center
              hover:shadow-xl transition-shadow">
            <Link className="w-10/12 flex flex-col md:flex-row cursor-pointer" to={`${workout.id}`}>
                <h3 className="font-bold text-xl md:w-2/12">{workout.name}</h3>
                <p className="md:w-10/12">{workout.description}</p>
            </Link>
            <div className="md:w-4/12 lg:w-3/12 xl:w-2/12 flex *:flex-grow gap-2">
                <IconButton icon={faPencil} onClick={onEdit}>{"Edit"}</IconButton>
                <IconButton icon={faX} color="danger" onClick={onDelete}>{"Delete"}</IconButton>
            </div>
        </div>
    );
});

export default WorkoutCard;