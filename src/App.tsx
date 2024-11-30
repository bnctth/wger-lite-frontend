import LoginLayout from "./pages/Login/LoginLayout.tsx";
import {BrowserRouter, Route, Routes} from "react-router";
import HostnameSelector from "./pages/Login/HostnameSelector.tsx";
import Login from "./pages/Login/Login.tsx";
import AuthGuardLayout from "./pages/AuthGuardLayout.tsx";

function App() {
    return <BrowserRouter>
        <Routes>
            <Route element={<AuthGuardLayout/>}>
                <Route index element={"Foo"}/>
                <Route path="auth" element={<LoginLayout/>}>
                    <Route path="set-hostname" element={<HostnameSelector/>}/>
                    <Route path="login" element={<Login/>}/>
                </Route>
            </Route>
        </Routes>
    </BrowserRouter>
}

export default App
