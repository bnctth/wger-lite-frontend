import {MutableRefObject, useRef, useState} from "react";
import TextInput from "../components/form/TextInput.tsx";
import Button from "../components/form/Button.tsx";
import {faEye, faEyeSlash, faRightToBracket, faSpinner} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {apiService, tokenService} from "../services/Instances.ts";
import IconButton from "../components/form/IconButton.tsx";
import TextInputWithButton from "../components/form/TextInputWithButton.tsx";

const LoginFlow = ({onLogIn}: { onLogIn: () => void }) => {
    const [stage, setStage] = useState(0)
    return <div className="flex min-h-dvh justify-center items-center bg-primary">
        <div
            className="bg-white w-full min-h-dvh md:w-4/12 md:min-h-0 rounded py-10 px-20 flex items-center flex-col gap-10 shadow">
            <h1 className="text-2xl">Login</h1>
            {stage == 0 && <HostnameSelector next={() => setStage(1)}></HostnameSelector>}
            {stage == 1 && <Login next={onLogIn}></Login>}
        </div>
    </div>
}

const HostnameSelector = ({next}: { next: () => void }) => {
    const [hostname, setHostname] = useState('https://wger.de')
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const form: MutableRefObject<HTMLFormElement | null> = useRef(null);
    return (<form ref={form} className="w-full flex flex-col gap-5" onSubmit={async (event) => {

        event.preventDefault()
        setButtonDisabled(true);
        apiService.baseUrl = hostname
        await apiService.checkServer().caseOf({
                Right: () => {
                    next();
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

const Login = ({next}: { next: () => void }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const form: MutableRefObject<HTMLFormElement | null> = useRef(null);
    return (<form ref={form} className="w-full flex flex-col gap-5" onSubmit={async (event) => {
        event.preventDefault()
        setButtonDisabled(true);
        await tokenService.login(username, password).caseOf({
                Right: () => {
                    next();
                }, Left: err => {
                    console.log(err);
                    setErrorMessage('Wrong username or password')
                }
            }
        )
        setButtonDisabled(false);
    }}>
        {errorMessage && <div className="bg-error-faded border-error border-2 rounded p-2">{errorMessage}</div>}
        <TextInput value={username} onChange={setUsername} placeholder="john.doe" label="Username"
                   type="text" required={true}></TextInput>
        <TextInputWithButton buttonIcon={passwordVisible ? faEyeSlash : faEye}
                             onClick={() => setPasswordVisible(v => !v)} value={password} onChange={setPassword}
                             placeholder="****" label="Password"
                             type={passwordVisible ? "text" : "password"} required={true}/>
        <IconButton icon={faRightToBracket} onClick={() => form.current?.requestSubmit()} disabled={buttonDisabled}>
            {buttonDisabled
                && <FontAwesomeIcon icon={faSpinner} className="animate-spin"/>
                || "Login"}
        </IconButton>
    </form>)
}
export default LoginFlow