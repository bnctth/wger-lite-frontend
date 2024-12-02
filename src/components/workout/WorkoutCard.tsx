import {WorkoutDto} from "../../services/Dtos.ts";
import Card from "../list-pages/Card.tsx";

const WorkoutCard = ({workout, onEdit, onDelete}: {
    workout: WorkoutDto,
    onEdit: () => void,
    onDelete: () => void
}) => {
    return (
        <Card onEdit={onEdit} onDelete={onDelete} linkTo={`${workout.id}`}>
            <h3 className="font-bold text-xl md:w-2/12">{workout.name}</h3>
            <p className="md:w-10/12">{workout.description}</p>
        </Card>
    )
};

export default WorkoutCard;