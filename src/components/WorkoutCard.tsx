import {WorkoutDto} from "../services/Dtos.ts";
import {Link} from "react-router";

const WorkoutCard = ({workout}: { workout: WorkoutDto }) => {
    return (
        <Link to={`${workout.id}`} key={workout.id}
              className="w-full flex shadow rounded border py-3 px-10 items-center hover:shadow-xl cursor-pointer transition-shadow">
            <h3 className="font-bold text-xl w-2/12">{workout.name}</h3>
            <p className="w-10/12">{workout.description}</p>
        </Link>
    );
};

export default WorkoutCard;