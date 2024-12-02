import Form from "../form/Form.tsx";
import {Mutation} from "../../utils.ts";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {ReactNode} from "react";

const Editor = ({mutation, submitIcon, headingText, children, errorMessage}: {
    headingText: string,
    submitIcon: IconProp,
    mutation: Mutation,
    children: ReactNode,
    errorMessage: string
}) => {
    return (
        <Form mutation={mutation} errorMessage={errorMessage} submitText={headingText}
              submitIcon={submitIcon} headingText={headingText}>
            {children}
        </Form>
    );
};

export default Editor;