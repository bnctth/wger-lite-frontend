import {useContext, useEffect} from "react";
import {ApiServiceContext} from "../services/Instances.ts";
import {TitleContext} from "../components/layouts/TopBarLayout.tsx";
import MutablePaginated from "../components/list-pages/MutablePaginated.tsx";
import {useQuery} from "@tanstack/react-query";
import {eitherAsyncToQueryFn} from "../utils.ts";
import {useParams} from "react-router";
import {SetEndpoint} from "../services/CrudEndpoint.ts";
import SetCard from "../components/set/SetCard.tsx";
import SetEditor from "../components/set/SetEditor.tsx";

const limit = 5

const Sets = () => {
    const apiService = useContext(ApiServiceContext)
    const setTitle = useContext(TitleContext)
    const {trainingDayId} = useParams() as unknown as { workoutId: number, trainingDayId: number }
    const {data: trainingDay} = useQuery({
        queryKey: ['trainingDay', {id: trainingDayId}],
        queryFn: eitherAsyncToQueryFn(apiService.read(SetEndpoint, trainingDayId))
    })
    useEffect(() => setTitle(`${trainingDay?.comment ?? ''} | Sets`))


    return <MutablePaginated
        name="set"
        getItems={(page) => ({offset: page * limit, limit})}
        renderTemplate={(item, onEdit, onDelete) =>
            <SetCard key={item.id} item={item} onEdit={onEdit} onDelete={onDelete}/>
        }
        renderEditor={(mutation, mode, item, setWorkout) =>
            <SetEditor mutation={mutation} item={item} setItem={setWorkout} mode={mode}/>}
        queryKey={['trainingDay', trainingDay]}
        defaultEditorValue={{exerciseDay: trainingDay, sets: 0, order: Date.now(), comment: ''}}
        pageCount={c => Math.ceil(c / limit)}
        endpoint={SetEndpoint}
        parentId={trainingDayId}
        ordering="order"
    />


}

export default Sets