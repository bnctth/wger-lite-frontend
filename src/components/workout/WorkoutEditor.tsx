import Form from "../form/Form.tsx";
import TextInput from "../form/TextInput.tsx";
import {Mutation} from "../../utils.ts";
import {IconProp} from "@fortawesome/fontawesome-svg-core";

const WorkoutEditor = ({setName, name, desc, setDesc, mutation, submitIcon, headingText}: {
    headingText: string,
    submitIcon: IconProp,
    mutation: Mutation,
    name: string,
    setName: (v: string) => void,
    desc: string,
    setDesc: (v: string) => void
}) => {
    return (
        <Form mutation={mutation} errorMessage="Could not add/edit workout" submitText={headingText}
              submitIcon={submitIcon} headingText={headingText}>
            <TextInput label="Name" placeholder="My workout" value={name} onChange={setName}/>
            <TextInput label="Description" placeholder="All about my new workout..." value={desc}
                       onChange={setDesc}/>
        </Form>
    );
};

export default WorkoutEditor;