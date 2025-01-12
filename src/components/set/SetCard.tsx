import { SetViewDto } from "../../services/Dtos.ts";
import Card from "../list-pages/Card.tsx";

/**
 * Card for displaying a set
 * @param item Set to display
 * @param onEdit Function to call when the edit button is clicked
 * @param onDelete Function to call when the delete button is clicked
 * @constructor
 */
const SetCard = ({
                   item,
                   onEdit,
                   onDelete
                 }: {
  item: SetViewDto;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  return (
    <Card onEdit={onEdit} onDelete={onDelete} linkTo="">
      <h3 className="font-bold text-xl md:w-2/12">{item.comment}</h3>
      <p className="md:w-10/12">{item.sets} set</p>
    </Card>
  );
};

export default SetCard;
