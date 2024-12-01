import {MutableRefObject, useContext, useRef, useState} from "react";
import TextInput from "../../components/form/TextInput.tsx";
import {useNavigate} from "react-router";
import {useMutation} from "@tanstack/react-query";
import {eitherAsyncToQueryFn} from "../../utils.ts";
import {ApiServiceContext} from "../../services/Instances.ts";
import LoadingIconButton from "../../components/form/LoadingIconButton.tsx";
import ErrorBox from "../../components/ErrorBox.tsx";

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
        <ErrorBox enabled={mutation.isError}>
            {errorMessage}
        </ErrorBox>
        <TextInput value={hostname} onChange={setHostname} placeholder="https://wger.de" label="Hostname" type="url"/>
        <LoadingIconButton onClick={() => form.current?.requestSubmit()} loading={mutation.isLoading}>
            Next
        </LoadingIconButton>
    </form>)
}

export default HostnameSelector