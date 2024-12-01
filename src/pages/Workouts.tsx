import Paginated from "../components/Paginated.tsx";
import {WorkoutDto} from "../services/Dtos.ts";
import {eitherAsyncToQueryFn} from "../utils.ts";
import {useContext} from "react";
import {ApiServiceContext} from "../services/Instances.ts";
import WorkoutCard from "../components/WorkoutCard.tsx";

const limit = 5
const Workouts = () => {
    const apiService = useContext(ApiServiceContext)
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