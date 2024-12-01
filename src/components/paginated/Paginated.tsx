import {PaginatedDataListDto} from "../../services/Dtos.ts";
import {ReactNode, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import Button from "../form/Button.tsx";
import IconButton from "../form/IconButton.tsx";
import {faAngleLeft, faAngleRight, faAnglesLeft, faAnglesRight} from "@fortawesome/free-solid-svg-icons";

const Paginated = <T, >({
                            queryKey,
                            queryFn,
                            templateSuccess,
                            errorComponent,
                            loadingComponent,
                            pageCount,
                            emptyComponent
                        }: {
    queryFn: (page: number) => () => Promise<PaginatedDataListDto<T>>,
    templateSuccess: (data: T) => ReactNode,
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
    if (status === 'error') {
        return errorComponent
    }
    if (status === 'loading') {
        return loadingComponent
    }
    if (!data?.count) {
        return emptyComponent
    }
    const calcPageCount = pageCount(data.count)
    return (
        <div className="w-full h-full px-10 md:px-20 pb-10 md:pb-20 flex flex-col items-center justify-between">
            <div className="w-full flex flex-col">
                {data.results.map(d => templateSuccess(d))}
            </div>
            <div className="flex justify-between w-9/12 items-center flex-wrap *:flex-grow">
                <div className="flex justify-center gap-4 *:flex-grow md:*:flex-grow-0">
                    <IconButton icon={faAnglesLeft} onClick={() => setPage(0)} disabled={page === 0}></IconButton>
                    <IconButton icon={faAngleLeft} onClick={() => setPage(p => p - 1)}
                                disabled={page === 0}></IconButton>
                </div>
                <div className="flex justify-center gap-4 *:flex-grow md:*:flex-grow-0">
                    {Array.from(Array(calcPageCount).keys()).map(n => <Button key={n}
                                                                              onClick={() => setPage(n)}
                                                                              disabled={n === page}>{n + 1}</Button>)}
                </div>
                <div className="flex justify-center gap-4 *:flex-grow md:*:flex-grow-0">
                    <IconButton icon={faAngleRight} onClick={() => setPage(p => p + 1)}
                                disabled={page === calcPageCount - 1}></IconButton>
                    <IconButton icon={faAnglesRight} onClick={() => setPage(calcPageCount - 1)}
                                disabled={page === calcPageCount - 1}></IconButton>
                </div>
            </div>
        </div>
    );
};

export default Paginated;