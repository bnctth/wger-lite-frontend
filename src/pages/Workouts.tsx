import {CreateWorkoutDto, WorkoutDto} from "../services/Dtos.ts";
import {useContext, useEffect} from "react";
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


    return <MutablePaginated<CreateWorkoutDto, WorkoutDto>
        name="workout"
        getItems={(page) => apiService.getWorkouts(page * limit, limit)}
        createAction={apiService.createWorkout}
        editAction={apiService.editWorkout}
        deleteAction={apiService.deleteWorkout}
        renderTemplate={(w, onEdit, onDelete) =>
            <WorkoutCard key={w.id} workout={w} onEdit={onEdit} onDelete={onDelete}/>
        }
        renderEditor={(mutation, mode, workout, setWorkout) =>
            <WorkoutEditor mutation={mutation} workout={workout} setWorkout={setWorkout}
                           headingText={mode === 'create' ? "Create workout" : "Edit workout"}
                           submitIcon={mode === 'create' ? faPlus : faPencil}/>}
        queryKey={['workout']}
        defaultEditorValue={{name: '', description: ''}}
        pageCount={c => Math.ceil(c / limit)}
    />


}

export default Workouts