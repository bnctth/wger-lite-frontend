import LoginFlow from "./pages/LoginFlow.tsx";
import {useState} from "react";
import {tokenService} from "./services/Instances.ts";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(tokenService.isLoggedIn())
    return <>{isLoggedIn && "Foo" || <LoginFlow onLogIn={() => setIsLoggedIn(true)}></LoginFlow>}</>
}

export default App
