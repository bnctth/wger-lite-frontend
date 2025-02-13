import Form from "../form/Form.tsx";
import { Mutation } from "../../utils.ts";
import { ReactNode, useContext } from "react";
import { faPencil, faPlus } from "@fortawesome/free-solid-svg-icons";
import { PageNameContext, ReducedMode } from "./MutablePaginated.tsx";

/**
 * Base component for creating and editing pages.
 * @param mutation - The mutation to be called when the form is submitted.
 * @param children - The form fields.
 * @param mode - The mode of the editor. Either 'create' or 'edit'.
 */
const Editor = ({
                  mutation,
                  children,
                  mode
                }: {
  mutation: Mutation;
  children: ReactNode;
  mode: ReducedMode;
}) => {
  const pageName = useContext(PageNameContext);
  const txt = mode === "create" ? `Add ${pageName}` : `Edit ${pageName}`;
  return (
    <Form
      mutation={mutation}
      errorMessage={`Could not add/edit ${pageName}`}
      submitText={txt}
      submitIcon={mode === "create" ? faPlus : faPencil}
      headingText={txt}
    >
      {children}
    </Form>
  );
};

export default Editor;
