import {TrainingDayEditDto, TrainingDayViewDto} from "../services/Dtos.ts";
import {useContext, useEffect} from "react";
import {ApiServiceContext} from "../services/Instances.ts";
import {TitleContext} from "../components/layouts/TopBarLayout.tsx";
import MutablePaginated from "../components/list-pages/MutablePaginated.tsx";
import {TrainingDayEndpoint, WorkoutEndpoint} from "../services/crud-endpoints.ts";
import {useQuery} from "@tanstack/react-query";
import {eitherAsyncToQueryFn} from "../utils.ts";
import {useParams} from "react-router";
import TrainingDayCard from "../components/training-day/TrainingDayCard.tsx";
import TrainingDayEditor from "../components/training-day/TrainingDayEditor.tsx";

const limit = 5

const TrainingDays = () => {
    const apiService = useContext(ApiServiceContext)
    const setTitle = useContext(TitleContext)
    const {workoutId} = useParams() as unknown as { workoutId: number }
    const {data: workout} = useQuery({
        queryKey: ['workout', {id: workoutId}],
        queryFn: eitherAsyncToQueryFn(apiService.read(WorkoutEndpoint, workoutId))
    })
    useEffect(() => setTitle(`${workout?.name ?? ''} | Training days`))


    return <MutablePaginated<TrainingDayEditDto, TrainingDayViewDto>
        name="training day"
        getItems={(page) => apiService.list(TrainingDayEndpoint, page * limit, limit, workoutId)}
        createAction={(dto) => apiService.create(TrainingDayEndpoint, dto)} //lambda necessary because of the context of `this`
        editAction={(id, dto) => apiService.update(TrainingDayEndpoint, id, dto)}
        deleteAction={(id) => apiService.delete(TrainingDayEndpoint, id)}
        renderTemplate={(item, onEdit, onDelete) =>
            <TrainingDayCard key={item.id} item={item} onEdit={onEdit} onDelete={onDelete}/>
        }
        renderEditor={(mutation, mode, item, setWorkout) =>
            <TrainingDayEditor mutation={mutation} item={item} setItem={setWorkout} mode={mode}/>}
        queryKey={['workout', workoutId]}
        defaultEditorValue={{day: [], training: workoutId, description: ''}}
        pageCount={c => Math.ceil(c / limit)}
    />


}

export default TrainingDays