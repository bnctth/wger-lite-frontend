import TextInput from "../form/TextInput.tsx";
import {impressions, Mutation} from "../../utils.ts";
import Editor from "../list-pages/Editor.tsx";
import {SessionEditDto} from "../../services/Dtos.ts";
import {Dispatch, SetStateAction} from "react";
import {ReducedMode} from "../list-pages/MutablePaginated.tsx";
import RadioButtonList from "../form/RadioButtonList.tsx";

const SessionEditor = ({item, setItem, mutation, mode}: {
    mode: ReducedMode,
    mutation: Mutation,
    item: SessionEditDto,
    setItem: Dispatch<SetStateAction<SessionEditDto>>
}) => {
    return (
        <Editor mutation={mutation} mode={mode}>
            <TextInput label="Date" type="date" placeholder={new Date().toDateString()} value={item.date}
                       onChange={(v) => setItem(w => ({
                           ...w,
                           date: v
                       }))}/>
            <TextInput label="Time start" type="time" placeholder="0:00" value={item.time_start}
                       onChange={(v) => setItem(w => ({
                           ...w,
                           time_start: v
                       }))}/>
            <TextInput label="Time end" type="time" placeholder="0:00" value={item.time_end}
                       onChange={(v) => setItem(w => ({
                           ...w,
                           time_end: v
                       }))}/>
            <TextInput label="Notes" placeholder="Nothing special happened" value={item.notes}
                       onChange={(v) => setItem(w => ({
                           ...w,
                           notes: v
                       }))}/>
            <RadioButtonList names={impressions} selected={item.impression as unknown as number - 1}
                             setSelected={(val) => setItem(item => ({
                                 ...item,
                                 impression: val + 1 as unknown as string
                             }))}/>
        </Editor>
    );
};

export default SessionEditor;