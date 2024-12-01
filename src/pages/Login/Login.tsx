import {MutableRefObject, useContext, useRef, useState} from "react";
import TextInput from "../../components/form/TextInput.tsx";
import TextInputWithButton from "../../components/form/TextInputWithButton.tsx";
import {faEye, faEyeSlash, faRightToBracket} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router";
import {useMutation} from "@tanstack/react-query";
import {eitherAsyncToQueryFn} from "../../utils.ts";
import {TokenServiceContext} from "../../services/Instances.ts";
import LoadingIconButton from "../../components/form/LoadingIconButton.tsx";
import ErrorBox from "../../components/ErrorBox.tsx";

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [passwordVisible, setPasswordVisible] = useState(false)

    const [errorMessage, setErrorMessage] = useState('')

    const form: MutableRefObject<HTMLFormElement | null> = useRef(null);

    const tokenService = useContext(TokenServiceContext)
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
        <ErrorBox enabled={mutation.isError}>
            {errorMessage}
        </ErrorBox>
        <TextInput value={username} onChange={setUsername} placeholder="john.doe" label="Username"
                   type="text" required={true}></TextInput>
        <TextInputWithButton buttonIcon={passwordVisible ? faEyeSlash : faEye}
                             onClick={() => setPasswordVisible(v => !v)} value={password} onChange={setPassword}
                             placeholder="****" label="Password"
                             type={passwordVisible ? "text" : "password"} required={true}/>
        <LoadingIconButton icon={faRightToBracket} onClick={() => form.current?.requestSubmit()}
                           loading={mutation.isLoading}>
            Login
        </LoadingIconButton>
    </form>)
}

export default Login