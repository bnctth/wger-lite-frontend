import Paginated from "../components/Paginated.tsx";
import {WorkoutDto} from "../services/Dtos.ts";
import {eitherAsyncToQueryFn} from "../utils.ts";
import {useContext, useEffect, useState} from "react";
import {ApiServiceContext} from "../services/Instances.ts";
import WorkoutCard from "../components/workout/WorkoutCard.tsx";
import {TitleContext} from "../components/layouts/TopBarLayout.tsx";
import IconButton from "../components/form/IconButton.tsx";
import {faPencil, faPlus} from "@fortawesome/free-solid-svg-icons";
import {ModalContext} from "../components/layouts/ModalLayout.tsx";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import WorkoutEditor from "../components/workout/WorkoutEditor.tsx";
import Form from "../components/form/Form.tsx";

const limit = 5
const workoutKey = ['workout']

const Workouts = () => {
    const apiService = useContext(ApiServiceContext)
    const queryClient = useQueryClient()
    const setTitle = useContext(TitleContext)
    useEffect(() => setTitle('Workouts'))

    const {setChildren, setEnabled: setModalEnabled} = useContext(ModalContext)

    const [editorWorkoutName, setEditorWorkoutName] = useState('')
    const [editorWorkoutDesc, setEditorWorkoutDesc] = useState('')
    const [mode, setMode] = useState<'create' | 'edit' | 'delete'>('create')
    const [selectedId, setSelectedId] = useState<number | undefined>(undefined)
    let mutationFn;
    switch (mode) {
        case "create":
            mutationFn = apiService.createWorkout(editorWorkoutName, editorWorkoutDesc)
            break;
        case "edit":
            mutationFn = apiService.editWorkout(selectedId ?? -1, editorWorkoutName, editorWorkoutDesc)
            break;
        case "delete":
            mutationFn = apiService.deleteWorkout(selectedId ?? -1)
            break;
    }
    const mutation = useMutation({
        mutationFn: eitherAsyncToQueryFn(mutationFn),
        onSuccess: async () => {
            setModalEnabled(false)
            await queryClient.invalidateQueries(workoutKey)
        },
        retry: false
    })
    useEffect(() => {
        if (mode === 'create' || mode == 'edit') {
            setChildren(
                <WorkoutEditor mutation={mutation} name={editorWorkoutName} setName={setEditorWorkoutName}
                               desc={editorWorkoutDesc}
                               setDesc={setEditorWorkoutDesc}
                               headingText={mode === 'create' ? "Create workout" : "Edit workout"}
                               submitIcon={mode === 'create' ? faPlus : faPencil}/>
            )
        } else {
            setChildren(
                <Form errorMessage="Could not delete workout" submitText="Delete" mutation={mutation}>
                    foo
                </Form>
            )
        }
    }, [mode, setChildren, editorWorkoutName, editorWorkoutDesc, mutation]);


    return <div className="h-full w-full flex flex-col items-center gap-10">
        <div className="w-full flex justify-center md:justify-end px-20">
            <IconButton icon={faPlus} onClick={() => {
                mutation.reset()
                setEditorWorkoutName('')
                setEditorWorkoutDesc('')
                setModalEnabled(true)
            }}>Add workout</IconButton>
        </div>
        <Paginated<WorkoutDto>
            queryFn={(page) => eitherAsyncToQueryFn(apiService.getWorkouts(page * limit, limit))}
            renderTemplate={(w) => <WorkoutCard key={w.id} workout={w} onEdit={() => {
                mutation.reset()
                setMode('edit')
                setSelectedId(w.id)
                setEditorWorkoutName(w.name)
                setEditorWorkoutDesc(w.description)
                setModalEnabled(true)
            }} onDelete={() => {
                mutation.reset()
                setMode('delete')
                setSelectedId(w.id)
                setModalEnabled(true)
            }}/>}
            loadingComponent={"Loading"}
            errorComponent={"Error"}
            emptyComponent={"Empty"}
            queryKey={workoutKey}
            pageCount={c => Math.ceil(c / limit)}
        />
    </div>
}

export default Workouts