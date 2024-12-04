import {
    SessionEditDto,
    SessionViewDto,
    SetEditDto,
    SetViewDto,
    TrainingDayEditDto,
    TrainingDayViewDto,
    WorkoutEditDto,
    WorkoutViewDto
} from "./Dtos.ts";

/**
 * Represents a CRUD endpoint. The endpoint is defined by the name of the entity and the parent entity if any.
 * @param _TEditDto The type of the edit DTO.
 * @param _TViewDto The type of the view DTO.
 * @param TParent The type of the parent entity. If the entity has no parent, this should be `undefined`.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface CrudEndpoint<_TEditDto, _TViewDto, TParent extends string | undefined = undefined> {
    name: string,
    parent: TParent
}

/**
 * Represents a CRUD endpoint for the `Workout` entity.
 */
export const WorkoutEndpoint: CrudEndpoint<WorkoutEditDto, WorkoutViewDto> = {
    name: 'workout',
    parent: undefined
}

/**
 * Represents a CRUD endpoint for the `TrainingDay` entity.
 */
export const TrainingDayEndpoint: CrudEndpoint<TrainingDayEditDto, TrainingDayViewDto, string> = {
    name: 'day',
    parent: 'training'
}

/**
 * Represents a CRUD endpoint for the `Set` entity.
 */
export const SetEndpoint: CrudEndpoint<SetEditDto, SetViewDto, string> = {
    name: 'set',
    parent: 'exerciseday'
}

/**
 * Represents a CRUD endpoint for the `Session` entity.
 */
export const SessionEndpoint: CrudEndpoint<SessionEditDto, SessionViewDto, string> = {
    name: 'workoutsession',
    parent: 'workout'
}