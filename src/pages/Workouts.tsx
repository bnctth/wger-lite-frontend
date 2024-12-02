import {useContext, useEffect} from "react";
import WorkoutCard from "../components/workout/WorkoutCard.tsx";
import {TitleContext} from "../components/layouts/TopBarLayout.tsx";
import WorkoutEditor from "../components/workout/WorkoutEditor.tsx";
import MutablePaginated from "../components/list-pages/MutablePaginated.tsx";
import {WorkoutEndpoint} from "../services/CrudEndpoint.ts";

const limit = 5

const Workouts = () => {
    const setTitle = useContext(TitleContext)
    useEffect(() => setTitle('Routines'))


    return <MutablePaginated
        name="workout"
        getItems={(page) => ({offset: page * limit, limit})}
        renderTemplate={(workout, onEdit, onDelete) =>
            <WorkoutCard key={workout.id} item={workout} onEdit={onEdit} onDelete={onDelete}/>
        }
        renderEditor={(mutation, mode, workout, setWorkout) =>
            <WorkoutEditor mutation={mutation} workout={workout} setWorkout={setWorkout}
                           mode={mode}/>}
        queryKey={['workout']}
        defaultEditorValue={{name: '', description: ''}}
        pageCount={c => Math.ceil(c / limit)}
        endpoint={WorkoutEndpoint}
        parentId={undefined}
    />


}

export default Workouts