import {WorkoutEditDto, WorkoutViewDto} from "../services/Dtos.ts";
import {useContext, useEffect} from "react";
import {ApiServiceContext} from "../services/Instances.ts";
import WorkoutCard from "../components/workout/WorkoutCard.tsx";
import {TitleContext} from "../components/layouts/TopBarLayout.tsx";
import WorkoutEditor from "../components/workout/WorkoutEditor.tsx";
import MutablePaginated from "../components/list-pages/MutablePaginated.tsx";
import {WorkoutEndpoint} from "../services/crud-endpoints.ts";

const limit = 5

const Workouts = () => {
    const apiService = useContext(ApiServiceContext)
    const setTitle = useContext(TitleContext)
    useEffect(() => setTitle('Routines'))


    return <MutablePaginated<WorkoutEditDto, WorkoutViewDto>
        name="workout"
        getItems={(page) => apiService.list(WorkoutEndpoint, page * limit, limit, undefined)}
        createAction={(dto) => apiService.create(WorkoutEndpoint, dto)} //lambda necessary because of the context of `this`
        editAction={(id, dto) => apiService.update(WorkoutEndpoint, id, dto)}
        deleteAction={(id) => apiService.delete(WorkoutEndpoint, id)}
        renderTemplate={(workout, onEdit, onDelete) =>
            <WorkoutCard key={workout.id} item={workout} onEdit={onEdit} onDelete={onDelete}/>
        }
        renderEditor={(mutation, mode, workout, setWorkout) =>
            <WorkoutEditor mutation={mutation} workout={workout} setWorkout={setWorkout}
                           mode={mode}/>}
        queryKey={['workout']}
        defaultEditorValue={{name: '', description: ''}}
        pageCount={c => Math.ceil(c / limit)}
    />


}

export default Workouts