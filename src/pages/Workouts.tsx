import Paginated from "../components/Paginated.tsx";
import {WorkoutDto} from "../services/Dtos.ts";
import {eitherAsyncToQueryFn} from "../utils.ts";
import {useContext, useEffect, useState} from "react";
import {ApiServiceContext} from "../services/Instances.ts";
import WorkoutCard from "../components/WorkoutCard.tsx";
import {TitleContext} from "../components/layouts/TopBarLayout.tsx";
import IconButton from "../components/form/IconButton.tsx";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {ModalContext} from "../components/layouts/ModalLayout.tsx";
import TextInput from "../components/form/TextInput.tsx";

const limit = 5
const Workouts = () => {
    const apiService = useContext(ApiServiceContext)
    const setTitle = useContext(TitleContext)
    useEffect(() => setTitle('Workouts'))

    const {setChildren, setEnabled: setModalEnabled} = useContext(ModalContext)
    const [newWorkoutName, setNewWorkoutName] = useState('')
    const [newWorkoutDesc, setNewWorkoutDesc] = useState('')
    useEffect(() => {
        setChildren(
            <div className="flex flex-col gap-6 items-center">
                <h1 className="text-lg">New workout</h1>
                <TextInput label="Name" placeholder="My workout" value={newWorkoutName} onChange={setNewWorkoutName}/>
                <TextInput label="Description" placeholder="All about my new workout..." value={newWorkoutDesc}
                           onChange={setNewWorkoutDesc}/>
                <IconButton icon={faPlus}>Create workout</IconButton>
            </div>
        )
    }, [setChildren, newWorkoutName, newWorkoutDesc]);
    return <div className="h-full w-full flex flex-col items-center gap-10">
        <div className="w-full flex justify-center md:justify-end px-20">
            <IconButton icon={faPlus} onClick={() => setModalEnabled(true)}>Add workout</IconButton>
        </div>
        <Paginated<WorkoutDto>
            queryFn={(page) => eitherAsyncToQueryFn(apiService.getWorkouts(page * limit, limit))}
            renderTemplate={(w) => <WorkoutCard key={w.id} workout={w}/>}
            loadingComponent={"Loading"}
            errorComponent={"Error"}
            emptyComponent={"Empty"}
            queryKey={['workout']}
            pageCount={c => Math.ceil(c / limit)}
        />
    </div>
}

export default Workouts