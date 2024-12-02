import {ReactNode, useContext, useEffect, useState} from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {ModalContext} from "../layouts/ModalLayout.tsx";
import {eitherAsyncToQueryFn, Mutation} from "../../utils.ts";
import Paginated from "./Paginated.tsx";
import {EitherAsync} from "purify-ts";
import {ApiError} from "../../services/ApiService.ts";
import Form from "../form/Form.tsx";
import IconButton from "../form/IconButton.tsx";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {PaginatedDataListDto} from "../../services/Dtos.ts";
import LoadingComponent from "./LoadingComponent.tsx";
import ErrorComponent from "./ErrorComponent.tsx";
import EmptyComponent from "./EmptyComponent.tsx";

type mode = 'create' | 'edit' | 'delete'

const MutablePaginated = <TDto, >({
                                      editAction,
                                      deleteAction,
                                      createAction,
                                      name,
                                      renderEditor,
                                      queryKey,
                                      getItems,
                                      renderTemplate,
                                      onCreate,
                                      onEdit,
                                      onDelete,
                                      pageCount
                                  }: {
    name: string,
    getItems: (page: number) => EitherAsync<ApiError, PaginatedDataListDto<TDto>>
    createAction: EitherAsync<ApiError, unknown>,
    editAction: EitherAsync<ApiError, unknown>,
    deleteAction: EitherAsync<ApiError, unknown>,
    renderTemplate: (item: TDto, onEdit: () => void, onDelete: () => void) => ReactNode,
    onCreate: () => void,
    onEdit: (item: TDto) => void,
    onDelete: (item: TDto) => void,
    renderEditor: (mutation: Mutation, mode: mode) => ReactNode,
    queryKey: unknown[],
    pageCount: (count: number) => number
}) => {
    const queryClient = useQueryClient()

    const {setChildren, setEnabled: setModalEnabled} = useContext(ModalContext)

    const [mode, setMode] = useState<mode>('create')

    const mutation = useMutation({
        mutationFn: async () => {
            switch (mode) {
                case "create":
                    return await eitherAsyncToQueryFn(createAction)()
                case "edit":
                    return await eitherAsyncToQueryFn(editAction)()
                case "delete":
                    return await eitherAsyncToQueryFn(deleteAction)()
            }
        },
        onSuccess: async () => {
            setModalEnabled(false)
            await queryClient.invalidateQueries(queryKey)
        },
        retry: false
    })
    useEffect(() => {
        if (mode === 'create' || mode == 'edit') {
            setChildren(renderEditor(mutation, mode) as JSX.Element)
        } else {
            setChildren(
                <Form headingText="Are you sure?" errorMessage={`Could not delete ${name}`} submitText="Delete"
                      mutation={mutation}>
                </Form>
            )
        }
    }, [mode, setChildren, mutation, renderEditor, name]);


    return <div className="h-full w-full flex flex-col items-center gap-10">
        <div className="w-full flex justify-center md:justify-end px-20">
            <IconButton icon={faPlus} onClick={() => {
                mutation.reset()
                setMode('create')
                onCreate()
                setModalEnabled(true)
            }}>Add {name}</IconButton>
        </div>
        <Paginated<TDto>
            queryFn={(page) => eitherAsyncToQueryFn(getItems(page))}
            renderTemplate={(i) => renderTemplate(i, () => {
                mutation.reset()
                setMode('edit')
                onEdit(i)
                setModalEnabled(true)
            }, () => {
                mutation.reset()
                setMode('delete')
                onDelete(i)
                setModalEnabled(true)
            })}
            loadingComponent={<LoadingComponent/>}
            errorComponent={<ErrorComponent/>}
            emptyComponent={<EmptyComponent/>}
            queryKey={queryKey}
            pageCount={pageCount}
        />
    </div>
}

export default MutablePaginated