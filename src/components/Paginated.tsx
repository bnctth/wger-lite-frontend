import {PaginatedDataListDto} from "../services/Dtos.ts";
import {ReactNode, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import Button from "./form/Button.tsx";
import IconButton from "./form/IconButton.tsx";
import {faAngleLeft, faAngleRight, faAnglesLeft, faAnglesRight} from "@fortawesome/free-solid-svg-icons";

const Paginated = <T, >({
                            queryKey,
                            queryFn,
                            renderTemplate,
                            errorComponent,
                            loadingComponent,
                            pageCount,
                            emptyComponent
                        }: {
    queryFn: (page: number) => () => Promise<PaginatedDataListDto<T>>,
    renderTemplate: (data: T) => ReactNode,
    loadingComponent: ReactNode,
    errorComponent: ReactNode,
    emptyComponent: ReactNode,
    queryKey: unknown[],
    pageCount: (count: number) => number
}) => {
    const [page, setPage] = useState(0)
    const {data, status} = useQuery({
        queryKey: [...queryKey, page],
        queryFn: queryFn(page),
        keepPreviousData: true
    })

    const calcPageCount = pageCount(data?.count ?? 0)

    return (
        <div className="w-full flex-grow px-10 md:px-20 pb-10 md:pb-20 flex flex-col items-center justify-between">
            <div className="w-full flex flex-col gap-6">
                {status === 'loading' && loadingComponent}
                {status === 'error' && errorComponent}
                {status === 'success' && data?.count === 0 && emptyComponent}
                {data?.results?.map(d => renderTemplate(d))}
            </div>
            {!!calcPageCount &&
                <div className="flex flex-col md:flex-row justify-between w-9/12 items-center *:flex-grow">
                    <div className="flex w-full justify-center gap-4 *:flex-grow md:*:flex-grow-0">
                        <IconButton icon={faAnglesLeft} onClick={() => setPage(0)} disabled={page === 0}></IconButton>
                        <IconButton icon={faAngleLeft} onClick={() => setPage(p => p - 1)}
                                    disabled={page === 0}></IconButton>
                    </div>
                    <div className="flex w-full justify-center gap-4 flex-wrap *:flex-grow md:*:flex-grow-0">
                        {Array.from(Array(5).keys())
                            .map(n => n + page - 2)
                            .map(n => {
                                if (n < 0) {
                                    return n + 5
                                }
                                if (n >= calcPageCount) {
                                    return n - 5
                                }
                                return n
                            })
                            .filter(n => n >= 0 && n < calcPageCount)
                            .sort((a, b) => (a - b))
                            .map(n =>
                                <Button key={n}
                                        onClick={() => setPage(n)}
                                        disabled={n === page}>{n + 1}</Button>
                            )}
                    </div>
                    <div className="flex w-full justify-center gap-4 *:flex-grow md:*:flex-grow-0">
                        <IconButton icon={faAngleRight} onClick={() => setPage(p => p + 1)}
                                    disabled={page === calcPageCount - 1}></IconButton>
                        <IconButton icon={faAnglesRight} onClick={() => setPage(calcPageCount - 1)}
                                    disabled={page === calcPageCount - 1}></IconButton>
                    </div>
                </div>}
        </div>
    )
        ;
};

export default Paginated;