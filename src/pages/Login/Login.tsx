import {useContext, useState} from "react";
import TextInput from "../../components/form/TextInput.tsx";
import TextInputWithButton from "../../components/form/TextInputWithButton.tsx";
import {faEye, faEyeSlash, faRightToBracket} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router";
import {useMutation} from "@tanstack/react-query";
import {eitherAsyncToQueryFn} from "../../utils.ts";
import {TokenServiceContext} from "../../services/Instances.ts";
import Form from "../../components/form/Form.tsx";

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [passwordVisible, setPasswordVisible] = useState(false)


    const tokenService = useContext(TokenServiceContext)
    const navigate = useNavigate()
    const mutation = useMutation({
        mutationFn: eitherAsyncToQueryFn(tokenService.login(username, password)),
        onSuccess: () => navigate('/'),
    })

    return (<Form mutation={mutation} submitText="Login" submitIcon={faRightToBracket}
                  errorMessage="Wrong username or password">

        <TextInput value={username} onChange={setUsername} placeholder="john.doe" label="Username"
                   type="text" required={true}></TextInput>
        <TextInputWithButton buttonIcon={passwordVisible ? faEyeSlash : faEye}
                             onClick={() => setPasswordVisible(v => !v)} value={password} onChange={setPassword}
                             placeholder="****" label="Password"
                             type={passwordVisible ? "text" : "password"} required={true}/>
    </Form>)
}

export default Login