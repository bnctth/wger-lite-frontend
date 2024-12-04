import {useContext, useEffect} from "react";
import {ApiServiceContext} from "../services/Instances.ts";
import {TitleContext} from "../components/layouts/TopBarLayout.tsx";
import MutablePaginated from "../components/list-pages/MutablePaginated.tsx";
import {useQuery} from "@tanstack/react-query";
import {eitherAsyncToQueryFn} from "../utils.ts";
import {useParams} from "react-router";
import {SessionEndpoint, WorkoutEndpoint} from "../services/CrudEndpoint.ts";
import SessionCard from "../components/session/SessionCard.tsx";
import SessionEditor from "../components/session/SessionEditor.tsx";

const limit = 5

/**
 * Page for managing sessions of a workout
 *
 * Path: /workouts/:workoutId/sessions
 */
const Sessions = () => {
    const apiService = useContext(ApiServiceContext)
    const setTitle = useContext(TitleContext)
    const {workoutId} = useParams() as unknown as { workoutId: number }
    const {data: workout} = useQuery({
        queryKey: ['workout', {id: workoutId}],
        queryFn: eitherAsyncToQueryFn(apiService.read(WorkoutEndpoint, workoutId))
    })
    useEffect(() => setTitle(`${workout?.name ?? ''} | Sessions`))


    return <MutablePaginated
        name="session"
        getItems={(page) => ({offset: page * limit, limit})}
        renderTemplate={(item, onEdit, onDelete) =>
            <SessionCard key={item.id} item={item} onEdit={onEdit} onDelete={onDelete}/>
        }
        renderEditor={(mutation, mode, item, setWorkout) =>
            <SessionEditor mutation={mutation} item={item} setItem={setWorkout} mode={mode}/>}
        queryKey={['workout', workout, 'session']}
        defaultEditorValue={{
            workout: workoutId,
            date: new Date().toDateString(),
            notes: '',
            impression: '2',
            time_start: '0:00',
            time_end: '0:00'
        }}
        pageCount={c => Math.ceil(c / limit)}
        endpoint={SessionEndpoint}
        parentId={workoutId}
        ordering="date"
    />


}

export default Sessions