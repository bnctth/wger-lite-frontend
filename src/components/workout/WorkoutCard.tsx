import {WorkoutViewDto} from "../../services/Dtos.ts";
import Card from "../list-pages/Card.tsx";

const WorkoutCard = ({item, onEdit, onDelete}: {
    item: WorkoutViewDto,
    onEdit: () => void,
    onDelete: () => void
}) => {
    return (
        <Card onEdit={onEdit} onDelete={onDelete} linkTo={`${item.id}`}>
            <h3 className="font-bold text-xl md:w-2/12">{item.name}</h3>
            <p className="md:w-10/12">{item.description}</p>
        </Card>
    )
};

export default WorkoutCard;