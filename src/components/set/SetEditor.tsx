import TextInput from "../form/TextInput.tsx";
import { Mutation } from "../../utils.ts";
import Editor from "../list-pages/Editor.tsx";
import { SetEditDto } from "../../services/Dtos.ts";
import { Dispatch, SetStateAction } from "react";
import { ReducedMode } from "../list-pages/MutablePaginated.tsx";

/**
 * Editor for sets
 * @param item the set to edit
 * @param setItem the setter for the set
 * @param mutation the mutation to use
 * @param mode the mode of the editor
 * @constructor
 */
const SetEditor = ({
                     item,
                     setItem,
                     mutation,
                     mode
                   }: {
  mode: ReducedMode;
  mutation: Mutation;
  item: SetEditDto;
  setItem: Dispatch<SetStateAction<SetEditDto>>;
}) => {
  return (
    <Editor mutation={mutation} mode={mode}>
      <TextInput
        label="Excercise and count"
        placeholder="20 pushups"
        value={item.comment}
        onChange={(v) =>
          setItem((w) => ({
            ...w,
            comment: v
          }))
        }
      />
      <TextInput
        label="Sets"
        placeholder="5"
        type="number"
        value={item.sets as unknown as string}
        onChange={(v) =>
          setItem((w) => ({
            ...w,
            sets: v as unknown as number
          }))
        }
      />
      <TextInput
        label="Order"
        placeholder="5"
        type="number"
        value={item.order as unknown as string}
        onChange={(v) =>
          setItem((w) => ({
            ...w,
            order: v as unknown as number
          }))
        }
      />
    </Editor>
  );
};

export default SetEditor;
