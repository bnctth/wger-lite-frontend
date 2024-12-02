import {TrainingDayViewDto} from "../../services/Dtos.ts";
import Card from "../list-pages/Card.tsx";
import {days} from "../../utils.ts";

const TrainingDayCard = ({item, onEdit, onDelete}: {
    item: TrainingDayViewDto,
    onEdit: () => void,
    onDelete: () => void
}) => {
    return (
        <Card onEdit={onEdit} onDelete={onDelete} linkTo={`${item.id}`}>
            <h3 className="font-bold text-xl md:w-2/12">{item.description}</h3>
            <div className="flex gap-2">
                {item.day.map(d => <span className="p-1 bg-light rounded" key={d}>{days[d]}</span>)}
            </div>
        </Card>
    )
};

export default TrainingDayCard;