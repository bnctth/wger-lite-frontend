import {WorkoutDto} from "../services/Dtos.ts";
import {Link} from "react-router";
import {memo} from "react";

const WorkoutCard = memo(({workout}: { workout: WorkoutDto }) => {
    return (
        <Link to={`${workout.id}`}
              className="w-full flex flex-col md:flex-row shadow rounded border py-3 px-3 md:px-10 items-center hover:shadow-xl cursor-pointer transition-shadow">
            <h3 className="font-bold text-xl md:w-2/12">{workout.name}</h3>
            <p className="md:w-10/12">{workout.description}</p>
        </Link>
    );
});

export default WorkoutCard;