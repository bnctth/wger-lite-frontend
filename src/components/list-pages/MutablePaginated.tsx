import {createContext, Dispatch, ReactNode, SetStateAction, useContext, useState} from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import Modal from "../Modal.tsx";
import {eitherAsyncToQueryFn, Mutation} from "../../utils.ts";
import Paginated from "./Paginated.tsx";
import {MaybeNumber} from "../../services/ApiService.ts";
import Form from "../form/Form.tsx";
import IconButton from "../form/IconButton.tsx";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import LoadingComponent from "./LoadingComponent.tsx";
import ErrorComponent from "./ErrorComponent.tsx";
import EmptyComponent from "./EmptyComponent.tsx";
import {CrudEndpoint} from "../../services/CrudEndpoint.ts";
import {ApiServiceContext} from "../../services/Instances.ts";

export type ReducedMode = 'create' | 'edit'
export type Mode = ReducedMode | 'delete'

/**
 * Context to pass down the name of the items being displayed
 */
export const PageNameContext = createContext('')

/**
 * A paginated list of items where the user can create, edit and delete items
 * @param endpoint The endpoint to use for the CRUD operations
 * @param name The name of the items being displayed
 * @param renderEditor A function that renders the editor for the items
 * @param queryKey The query key to use for the query
 * @param getItems A function that returns the offset and limit for the items to fetch
 * @param renderTemplate A function that renders a card for the items
 * @param pageCount A function that returns the number of pages for the items
 * @param defaultEditorValue The default value to use when creating a new item
 * @param parentId The id of the parent item - optional
 * @param ordering The ordering to use for the items - optional
 * @constructor
 */
const MutablePaginated = <TEditorDto extends Record<string, unknown>, TViewDto extends TEditorDto & {
    id: number
}, TParent extends string | undefined>({
                                           endpoint,
                                           name,
                                           renderEditor,
                                           queryKey,
                                           getItems,
                                           renderTemplate,
                                           pageCount,
                                           defaultEditorValue,
                                           parentId,
                                           ordering
                                       }: {
    name: string,
    getItems: (page: number) => { offset: number, limit: number }
    endpoint: CrudEndpoint<TEditorDto, TViewDto, TParent>,
    parentId: MaybeNumber<TParent>,
    ordering?: string
    renderTemplate: (item: TViewDto, onEdit: () => void, onDelete: () => void) => ReactNode,
    renderEditor: (mutation: Mutation, mode: ReducedMode, editorItem: TEditorDto, setEditorItem: Dispatch<SetStateAction<TEditorDto>>) => ReactNode,
    queryKey: unknown[],
    pageCount: (count: number) => number,
    defaultEditorValue: TEditorDto
}) => {
    const apiService = useContext(ApiServiceContext)
    const queryClient = useQueryClient()

    const [modalEnabled, setModalEnabled] = useState(false)

    const [mode, setMode] = useState<Mode>('create')

    const [selectedId, setSelectedId] = useState<number | undefined>()
    const [editorItem, setEditorItem] = useState<TEditorDto>(defaultEditorValue)

    const mutation = useMutation({
        mutationFn: async () => {
            switch (mode) {
                case "create":
                    return await eitherAsyncToQueryFn(apiService.create(endpoint, editorItem))()
                case "edit":
                    return await eitherAsyncToQueryFn(apiService.update(endpoint, selectedId ?? -1, editorItem))()
                case "delete":
                    return await eitherAsyncToQueryFn(apiService.delete(endpoint, selectedId ?? -1))()
            }
        },
        onSuccess: async () => {
            setModalEnabled(false)
            await queryClient.invalidateQueries(queryKey)
        },
        retry: false
    })


    return <PageNameContext.Provider value={name}>
        <div className="h-full w-full flex flex-col items-center gap-10">
            <Modal enabled={modalEnabled} setEnabled={setModalEnabled}>
                {
                    mode === 'create' || mode == 'edit' ?
                        renderEditor(mutation, mode, editorItem, setEditorItem) as JSX.Element
                        :
                        <Form headingText="Are you sure?" errorMessage={`Could not delete ${name}`} submitText="Delete"
                              mutation={mutation}>
                        </Form>
                }
            </Modal>
            <div className="w-full flex justify-center md:justify-end px-20">
                <IconButton icon={faPlus} onClick={() => {
                    mutation.reset()
                    setMode('create')
                    setEditorItem(defaultEditorValue)
                    setModalEnabled(true)
                }}>Add {name}</IconButton>
            </div>
            <Paginated<TViewDto>
                queryFn={(page) => {
                    const {offset, limit} = getItems(page)
                    return eitherAsyncToQueryFn(apiService.list(endpoint, offset, limit, parentId, ordering))
                }}
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
    </PageNameContext.Provider>
}

export default MutablePaginated