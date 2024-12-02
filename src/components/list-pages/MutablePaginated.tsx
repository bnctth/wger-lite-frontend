import {Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState} from "react";
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

const MutablePaginated = <TEditorDto, TViewDto extends TEditorDto & { id: number }>({
                                                                                        editAction,
                                                                                        deleteAction,
                                                                                        createAction,
                                                                                        name,
                                                                                        renderEditor,
                                                                                        queryKey,
                                                                                        getItems,
                                                                                        renderTemplate,
                                                                                        pageCount,
                                                                                        defaultEditorValue
                                                                                    }: {
    name: string,
    getItems: (page: number) => EitherAsync<ApiError, PaginatedDataListDto<TViewDto>>
    createAction: (item: TEditorDto) => EitherAsync<ApiError, unknown>,
    editAction: (id: number, item: TEditorDto) => EitherAsync<ApiError, unknown>,
    deleteAction: (id: number) => EitherAsync<ApiError, unknown>,
    renderTemplate: (item: TViewDto, onEdit: () => void, onDelete: () => void) => ReactNode,
    renderEditor: (mutation: Mutation, mode: mode, editorItem: TEditorDto, setEditorItem: Dispatch<SetStateAction<TEditorDto>>) => ReactNode,
    queryKey: unknown[],
    pageCount: (count: number) => number,
    defaultEditorValue: TEditorDto
}) => {
    const queryClient = useQueryClient()

    const {setChildren, setEnabled: setModalEnabled} = useContext(ModalContext)

    const [mode, setMode] = useState<mode>('create')

    const [selectedId, setSelectedId] = useState<number | undefined>()
    const [editorItem, setEditorItem] = useState<TEditorDto>(defaultEditorValue)

    const mutation = useMutation({
        mutationFn: async () => {
            switch (mode) {
                case "create":
                    return await eitherAsyncToQueryFn(createAction(editorItem))()
                case "edit":
                    return await eitherAsyncToQueryFn(editAction(selectedId ?? -1, editorItem))()
                case "delete":
                    return await eitherAsyncToQueryFn(deleteAction(selectedId ?? -1))()
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
            setChildren(renderEditor(mutation, mode, editorItem, setEditorItem) as JSX.Element)
        } else {
            setChildren(
                <Form headingText="Are you sure?" errorMessage={`Could not delete ${name}`} submitText="Delete"
                      mutation={mutation}>
                </Form>
            )
        }
    }, [mode, setChildren, mutation, renderEditor, name, editorItem]);


    return <div className="h-full w-full flex flex-col items-center gap-10">
        <div className="w-full flex justify-center md:justify-end px-20">
            <IconButton icon={faPlus} onClick={() => {
                mutation.reset()
                setMode('create')
                setEditorItem(defaultEditorValue)
                setModalEnabled(true)
            }}>Add {name}</IconButton>
        </div>
        <Paginated<TViewDto>
            queryFn={(page) => eitherAsyncToQueryFn(getItems(page))}
            renderTemplate={(i) => renderTemplate(i, () => {
                mutation.reset()
                setMode('edit')
                setSelectedId(i.id)
                setEditorItem(i)
                setModalEnabled(true)
            }, () => {
                mutation.reset()
                setMode('delete')
                setSelectedId(i.id)
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