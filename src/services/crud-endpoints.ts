import {TrainingDayEditDto, TrainingDayViewDto, WorkoutEditDto, WorkoutViewDto} from "./Dtos.ts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface CrudEndpoint<_TEditDto, _TViewDto, TParent extends string | undefined = undefined> {
    name: string,
    parent: TParent
}

export const WorkoutEndpoint: CrudEndpoint<WorkoutEditDto, WorkoutViewDto, undefined> = {
    name: 'workout',
    parent: undefined
}

export const TrainingDayEndpoint: CrudEndpoint<TrainingDayEditDto, TrainingDayViewDto, string> = {
    name: 'day',
    parent: 'training'
}