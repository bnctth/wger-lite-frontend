import {SessionViewDto} from "../../services/Dtos.ts";
import Card from "../list-pages/Card.tsx";
import {ButtonColorType, impressions} from "../../utils.ts";


const impressionColors: ButtonColorType[] = [
    'danger',
    'unimportant',
    'primary'
]

const SessionCard = ({item, onEdit, onDelete}: {
    item: SessionViewDto,
    onEdit: () => void,
    onDelete: () => void
}) => {
    const impression = item.impression as unknown as number - 1
    return (
        <Card onEdit={onEdit} onDelete={onDelete} linkTo={``}>
            <div className="md:w-3/12">
                <h3 className="font-bold text-xl ">{item.date}</h3>
                <h4>{item.time_start}-{item.time_end}</h4>
            </div>

            <div className="flex flex-col justify-between items-start w-full">
                <p>{item.notes}</p>
                <span
                    className={`px-1 py-0.5 self-center rounded text-light w-auto bg-${impressionColors[impression]}`}>{impressions[impression]}</span>
            </div>
        </Card>
    )
};

export default SessionCard;