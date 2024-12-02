import TextInput from "../form/TextInput.tsx";
import {Mutation} from "../../utils.ts";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import Editor from "../list-pages/Editor.tsx";
import {TrainingDayEditDto} from "../../services/Dtos.ts";
import {Dispatch, SetStateAction} from "react";

const TrainingDayEditor = ({item, setItem, mutation, submitIcon, headingText}: {
    headingText: string,
    submitIcon: IconProp,
    mutation: Mutation,
    item: TrainingDayEditDto,
    setItem: Dispatch<SetStateAction<TrainingDayEditDto>>
}) => {
    return (
        <Editor mutation={mutation} errorMessage="Could not add/edit " submitIcon={submitIcon}
                headingText={headingText}>
            <TextInput label="Name" placeholder="My workout" value={item.name} onChange={(v) => setItem(w => ({
                ...w,
                name: v
            }))}/>
            <TextInput label="Description" placeholder="All about my new workout..." value={item.description}
                       onChange={(v) => setItem(w => ({
                           ...w,
                           description: v
                       }))}/>
        </Editor>
    );
};

export default TrainingDayEditor;