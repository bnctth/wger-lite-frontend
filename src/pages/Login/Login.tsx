import {MutableRefObject, useRef, useState} from "react";
import {tokenService} from "../../services/Instances.ts";
import TextInput from "../../components/form/TextInput.tsx";
import TextInputWithButton from "../../components/form/TextInputWithButton.tsx";
import {faEye, faEyeSlash, faRightToBracket, faSpinner} from "@fortawesome/free-solid-svg-icons";
import IconButton from "../../components/form/IconButton.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useNavigate} from "react-router";

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const form: MutableRefObject<HTMLFormElement | null> = useRef(null);
    const navigate = useNavigate()
    return (<form ref={form} className="w-full flex flex-col gap-5" onSubmit={async (event) => {
        event.preventDefault()
        setButtonDisabled(true);
        await tokenService.login(username, password).caseOf({
                Right: () => {
                    navigate('/')
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

export default Login