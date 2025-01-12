import { Link, To } from "react-router";
import IconButton from "../form/IconButton.tsx";
import { faPencil, faX } from "@fortawesome/free-solid-svg-icons";
import { ReactNode } from "react";

/**
 * A card component that displays a link to a page, and has edit and delete buttons.
 * @param onEdit The function to call when the edit button is clicked.
 * @param onDelete The function to call when the delete button is clicked.
 * @param linkTo The link to navigate to when the card is clicked.
 * @param children The content of the card.
 * @param extraButton An extra button to display on the card. - optional
 */
const Card = ({
                onEdit,
                onDelete,
                children,
                linkTo,
                extraButton
              }: {
  onEdit: () => void;
  onDelete: () => void;
  linkTo: To;
  children: ReactNode;
  extraButton?: ReactNode;
}) => {
  return (
    <div
      className="w-full flex flex-col md:flex-row shadow rounded border py-3 px-3 md:px-10 items-center
              hover:shadow-xl transition-shadow"
    >
      <Link
        className="w-10/12 flex flex-col md:flex-row cursor-pointer"
        to={linkTo}
      >
        {children}
      </Link>
      <div className="md:w-5/12 lg:w-4/12 xl:w-3/12 flex *:flex-grow gap-2">
        {extraButton}
        <IconButton icon={faPencil} onClick={onEdit}>
          {"Edit"}
        </IconButton>
        <IconButton icon={faX} color="danger" onClick={onDelete}>
          {"Delete"}
        </IconButton>
      </div>
    </div>
  );
};

export default Card;
