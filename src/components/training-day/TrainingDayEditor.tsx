import TextInput from "../form/TextInput.tsx";
import { days, Mutation } from "../../utils.ts";
import Editor from "../list-pages/Editor.tsx";
import { TrainingDayEditDto } from "../../services/Dtos.ts";
import { Dispatch, SetStateAction } from "react";
import { ReducedMode } from "../list-pages/MutablePaginated.tsx";
import CheckboxList from "../form/CheckboxList.tsx";

/**
 * Editor for training day
 * @param item the training day
 * @param setItem the setter for the training day
 * @param mutation the mutation to use
 * @param mode the mode of the editor
 * @constructor
 */
const TrainingDayEditor = ({
                             item,
                             setItem,
                             mutation,
                             mode
                           }: {
  mode: ReducedMode;
  mutation: Mutation;
  item: TrainingDayEditDto;
  setItem: Dispatch<SetStateAction<TrainingDayEditDto>>;
}) => {
  return (
    <Editor mutation={mutation} mode={mode}>
      <TextInput
        label="Description"
        placeholder="Leg day"
        value={item.description}
        onChange={(v) =>
          setItem((w) => ({
            ...w,
            description: v
          }))
        }
      />
      <CheckboxList
        names={days}
        values={Array.of(...Array(7).keys()).map((i) =>
          item.day.includes(i + 1)
        )}
        setValues={(values) =>
          setItem((old) => ({
            ...old,
            day: values.flatMap((v, i) => (v ? [i + 1] : []))
          }))
        }
      />
    </Editor>
  );
};

export default TrainingDayEditor;
