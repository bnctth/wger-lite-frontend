import TextInput from "../form/TextInput.tsx";
import {Mutation} from "../../utils.ts";
import Editor from "../list-pages/Editor.tsx";
import {WorkoutEditDto} from "../../services/Dtos.ts";
import {Dispatch, SetStateAction} from "react";
import {ReducedMode} from "../list-pages/MutablePaginated.tsx";

const WorkoutEditor = ({workout, setWorkout, mutation, mode}: {
    mode: ReducedMode,
    mutation: Mutation,
    workout: WorkoutEditDto,
    setWorkout: Dispatch<SetStateAction<WorkoutEditDto>>
}) => {
    return (
        <Editor mutation={mutation} mode={mode}>
            <TextInput label="Name" placeholder="My workout" value={workout.name} onChange={(v) => setWorkout(w => ({
                ...w,
                name: v
            }))}/>
            <TextInput label="Description" placeholder="All about my new workout..." value={workout.description}
                       onChange={(v) => setWorkout(w => ({
                           ...w,
                           description: v
                       }))}/>
        </Editor>
    );
};

export default WorkoutEditor;