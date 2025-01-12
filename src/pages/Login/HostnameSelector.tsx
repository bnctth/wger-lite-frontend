import { useContext, useState } from "react";
import TextInput from "../../components/form/TextInput.tsx";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { eitherAsyncToQueryFn } from "../../utils.ts";
import { ApiServiceContext } from "../../services/Instances.ts";
import Form from "../../components/form/Form.tsx";

/**
 * Component to select the hostname of the server
 *
 * Path: /auth/hostname-selector
 */
const HostnameSelector = () => {
  const [hostname, setHostname] = useState("https://wger.de");

  const apiService = useContext(ApiServiceContext);
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: eitherAsyncToQueryFn(apiService.checkServer()),
    onMutate: () => {
      apiService.baseUrl = hostname;
    },
    onSuccess: () => navigate("/auth/login")
  });

  return (
    <Form mutation={mutation} errorMessage="Invalid server" submitText="Next">
      <TextInput
        value={hostname}
        onChange={setHostname}
        placeholder="https://wger.de"
        label="Hostname"
        type="url"
      />
    </Form>
  );
};

export default HostnameSelector;
