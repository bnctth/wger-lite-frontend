import { TrainingDayViewDto } from "../../services/Dtos.ts";
import Card from "../list-pages/Card.tsx";
import { days } from "../../utils.ts";

/**
 * Card for displaying training day
 * @param item the training day
 * @param onEdit callback for edit button
 * @param onDelete callback for delete button
 * @constructor
 */
const TrainingDayCard = ({
                           item,
                           onEdit,
                           onDelete
                         }: {
  item: TrainingDayViewDto;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const dayOfWeek = new Date().getDay() || 7; // 0 is sunday
  return (
    <Card onEdit={onEdit} onDelete={onDelete} linkTo={`${item.id}`}>
      <h3 className="font-bold text-xl md:w-2/12">{item.description}</h3>
      <div className="flex flex-col md:flex-row items-center justify-between w-full">
        <div className="flex gap-2">
          {item.day.map((d) => (
            <span
              className={
                "p-1 rounded " +
                (dayOfWeek === d ? "bg-primary-faded" : "bg-light")
              }
              key={d}
            >
              {days[d - 1]}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default TrainingDayCard;
