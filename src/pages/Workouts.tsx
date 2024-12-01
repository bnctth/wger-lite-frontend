import Paginated from "../components/Paginated.tsx";
import {WorkoutDto} from "../services/Dtos.ts";
import {eitherAsyncToQueryFn} from "../utils.ts";
import {useContext, useEffect} from "react";
import {ApiServiceContext} from "../services/Instances.ts";
import WorkoutCard from "../components/WorkoutCard.tsx";
import {TitleContext} from "../components/layouts/TopBarLayout.tsx";

const limit = 5
const Workouts = () => {
    const apiService = useContext(ApiServiceContext)
    const setTitle = useContext(TitleContext)
    useEffect(() => setTitle('Workouts'))
    return <Paginated<WorkoutDto>
        queryFn={(page) => eitherAsyncToQueryFn(apiService.getWorkouts(page * limit, limit))}
        renderTemplate={(w) => <WorkoutCard workout={w}/>}
        loadingComponent={"Loading"}
        errorComponent={"Error"}
        emptyComponent={"Empty"}
        queryKey={['workout']}
        pageCount={c => Math.ceil(c / limit)}
    />
}

export default Workouts