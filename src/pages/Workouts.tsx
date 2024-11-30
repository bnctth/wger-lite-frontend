import {apiService} from "../services/Instances.ts";
import Paginated from "../components/paginated/Paginated.tsx";
import {WorkoutDto} from "../services/Dtos.ts";

const limit = 5
const Workouts = () =>
    <Paginated<WorkoutDto>
        queryFn={(page) =>
            async () => (await apiService.getWorkouts(page * limit, limit).run()).unsafeCoerce()
        }
        templateSuccess={(w) => <p key={w.id}>{w.name}</p>}
        loadingComponent={"Loading"}
        errorComponent={"Error"}
        queryKey={['workout']}
        pageCount={c => Math.ceil(c / limit)}
    />


export default Workouts