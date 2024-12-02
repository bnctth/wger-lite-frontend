import {WorkoutEditDto, WorkoutViewDto} from "./Dtos.ts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface CrudEndpoint<_TEditDto, _TViewDto> {
    name: string
}

export const WorkoutEndpoint: CrudEndpoint<WorkoutEditDto, WorkoutViewDto> = {
    name: 'workout'
}