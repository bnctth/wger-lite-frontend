import {MutableRefObject, useContext, useRef, useState} from "react";
import TextInput from "../../components/form/TextInput.tsx";
import Button from "../../components/form/Button.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router";
import {useMutation} from "@tanstack/react-query";
import {eitherAsyncToQueryFn} from "../../utils.ts";
import {ApiServiceContext} from "../../services/Instances.ts";

const HostnameSelector = () => {
    const [hostname, setHostname] = useState('https://wger.de')

    const [errorMessage, setErrorMessage] = useState('')

    const form: MutableRefObject<HTMLFormElement | null> = useRef(null);

    const apiService = useContext(ApiServiceContext)
    const navigate = useNavigate();
    const mutation = useMutation({
        mutationFn: eitherAsyncToQueryFn(apiService.checkServer()),
        onSuccess: () => navigate('/auth/login'),
        onError: () => setErrorMessage('Invalid server')
    })

    return (<form ref={form} className="w-full flex flex-col gap-5" onSubmit={async (event) => {
        event.preventDefault()
        apiService.baseUrl = hostname
        mutation.mutate()
    }}>
        {mutation.isError && <div className="bg-error-faded border-error border-2 rounded p-2">{errorMessage}</div>}
        <TextInput value={hostname} onChange={setHostname} placeholder="https://wger.de" label="Hostname"
                   type="url"></TextInput>
        <Button onClick={() => form.current?.requestSubmit()} disabled={mutation.isLoading}>
            {mutation.isLoading
                && <FontAwesomeIcon icon={faSpinner} className="animate-spin"/>
                || "Next"}
        </Button>
    </form>)
}

export default HostnameSelector