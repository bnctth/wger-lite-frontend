import {MutableRefObject, useRef, useState} from "react";
import {tokenService} from "../../services/Instances.ts";
import TextInput from "../../components/form/TextInput.tsx";
import TextInputWithButton from "../../components/form/TextInputWithButton.tsx";
import {faEye, faEyeSlash, faRightToBracket, faSpinner} from "@fortawesome/free-solid-svg-icons";
import IconButton from "../../components/form/IconButton.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useNavigate} from "react-router";
import {useMutation} from "@tanstack/react-query";
import {eitherAsyncToQueryFn} from "../../utils.ts";

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const form: MutableRefObject<HTMLFormElement | null> = useRef(null);
    const navigate = useNavigate()
    const mutation = useMutation({
        mutationFn: eitherAsyncToQueryFn(tokenService.login(username, password)),
        onSuccess: () => navigate('/'),
        onError: () => setErrorMessage('Wrong username or password')
    })
    return (<form ref={form} className="w-full flex flex-col gap-5" onSubmit={async (event) => {
        event.preventDefault()
        mutation.mutate()
    }}>
        {mutation.isError && <div className="bg-error-faded border-error border-2 rounded p-2">{errorMessage}</div>}
        <TextInput value={username} onChange={setUsername} placeholder="john.doe" label="Username"
                   type="text" required={true}></TextInput>
        <TextInputWithButton buttonIcon={passwordVisible ? faEyeSlash : faEye}
                             onClick={() => setPasswordVisible(v => !v)} value={password} onChange={setPassword}
                             placeholder="****" label="Password"
                             type={passwordVisible ? "text" : "password"} required={true}/>
        <IconButton icon={faRightToBracket} onClick={() => form.current?.requestSubmit()} disabled={mutation.isLoading}>
            {mutation.isLoading
                && <FontAwesomeIcon icon={faSpinner} className="animate-spin"/>
                || "Login"}
        </IconButton>
    </form>)
}

export default Login