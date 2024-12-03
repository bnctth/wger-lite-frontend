import {SetViewDto} from "../../services/Dtos.ts";
import Card from "../list-pages/Card.tsx";

const SetCard = ({item, onEdit, onDelete}: {
    item: SetViewDto,
    onEdit: () => void,
    onDelete: () => void
}) => {
    return (
        <Card onEdit={onEdit} onDelete={onDelete} linkTo="">
            <h3 className="font-bold text-xl md:w-2/12">{item.comment}</h3>
            <p className="md:w-10/12">{item.sets} set</p>
        </Card>
    )
};

export default SetCard;