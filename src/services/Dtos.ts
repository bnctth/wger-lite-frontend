export type PaginatedDataListDto<T> = {
    count: number,
    next: string,
    previous: string,
    results: T[]
}

export type WorkoutDto = {
    id: number,
    name: string,
    creationDate: string,
    description: string
}