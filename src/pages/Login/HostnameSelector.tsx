import {MutableRefObject, useRef, useState} from "react";
import {apiService} from "../../services/Instances.ts";
import TextInput from "../../components/form/TextInput.tsx";
import Button from "../../components/form/Button.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router";

const HostnameSelector = () => {
    const [hostname, setHostname] = useState('https://wger.de')
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const form: MutableRefObject<HTMLFormElement | null> = useRef(null);
    const navigate = useNavigate();
    return (<form ref={form} className="w-full flex flex-col gap-5" onSubmit={async (event) => {

        event.preventDefault()
        setButtonDisabled(true);
        apiService.baseUrl = hostname
        await apiService.checkServer().caseOf({
                Right: () => {
                    navigate('/auth/login');
                }, Left: err => {
                    console.log(err);
                    setErrorMessage('Invalid server')
                }
            }
        )
        setButtonDisabled(false);
    }}>
        {errorMessage && <div className="bg-error-faded border-error border-2 rounded p-2">{errorMessage}</div>}
        <TextInput value={hostname} onChange={setHostname} placeholder="https://wger.de" label="Hostname"
                   type="url"></TextInput>
        <Button onClick={() => form.current?.requestSubmit()} disabled={buttonDisabled}>
            {buttonDisabled
                && <FontAwesomeIcon icon={faSpinner} className="animate-spin"/>
                || "Next"}
        </Button>
    </form>)
}

export default HostnameSelector