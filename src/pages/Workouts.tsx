import {apiService} from "../services/Instances.ts";
import Paginated from "../components/paginated/Paginated.tsx";
import {WorkoutDto} from "../services/Dtos.ts";
import {eitherAsyncToQueryFn} from "../utils.ts";

const limit = 5
const Workouts = () =>
    <Paginated<WorkoutDto>
        queryFn={(page) => eitherAsyncToQueryFn(apiService.getWorkouts(page * limit, limit))}
        templateSuccess={(w) => <p key={w.id}>{w.name}</p>}
        loadingComponent={"Loading"}
        errorComponent={"Error"}
        emptyComponent={"Empty"}
        queryKey={['workout']}
        pageCount={c => Math.ceil(c / limit)}
    />


export default Workouts