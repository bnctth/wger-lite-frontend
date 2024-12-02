import {WorkoutDto} from "../services/Dtos.ts";
import {useContext, useEffect, useState} from "react";
import {ApiServiceContext} from "../services/Instances.ts";
import WorkoutCard from "../components/workout/WorkoutCard.tsx";
import {TitleContext} from "../components/layouts/TopBarLayout.tsx";
import {faPencil, faPlus} from "@fortawesome/free-solid-svg-icons";
import WorkoutEditor from "../components/workout/WorkoutEditor.tsx";
import MutablePaginated from "../components/list-pages/MutablePaginated.tsx";

const limit = 5

const Workouts = () => {
    const apiService = useContext(ApiServiceContext)
    const setTitle = useContext(TitleContext)
    useEffect(() => setTitle('Routines'))


    const [editorWorkoutName, setEditorWorkoutName] = useState('')
    const [editorWorkoutDesc, setEditorWorkoutDesc] = useState('')
    const [selectedId, setSelectedId] = useState<number | undefined>(undefined)


    return <MutablePaginated<WorkoutDto>
        name="workout"
        getItems={(page) => apiService.getWorkouts(page * limit, limit)}
        createAction={apiService.createWorkout(editorWorkoutName, editorWorkoutDesc)}
        onCreate={() => {
            setEditorWorkoutName('')
            setEditorWorkoutDesc('')
        }}
        editAction={apiService.editWorkout(selectedId ?? -1, editorWorkoutName, editorWorkoutDesc)}
        deleteAction={apiService.deleteWorkout(selectedId ?? -1)}
        renderTemplate={(w, onEdit, onDelete) =>
            <WorkoutCard key={w.id} workout={w} onEdit={onEdit} onDelete={onDelete}/>
        }
        onEdit={(w) => {
            setSelectedId(w.id)
            setEditorWorkoutName(w.name)
            setEditorWorkoutDesc(w.description)
        }}
        onDelete={(w) => {
            setSelectedId(w.id)
        }}
        renderEditor={(mutation, mode) =>
            <WorkoutEditor mutation={mutation} name={editorWorkoutName}
                           setName={setEditorWorkoutName} desc={editorWorkoutDesc}
                           setDesc={setEditorWorkoutDesc}
                           headingText={mode === 'create' ? "Create workout" : "Edit workout"}
                           submitIcon={mode === 'create' ? faPlus : faPencil}/>}
        queryKey={['workout']}
        pageCount={c => Math.ceil(c / limit)}
    />


}

export default Workouts