import LoginLayout from "./pages/Login/LoginLayout.tsx";
import {BrowserRouter, Route, Routes} from "react-router";
import HostnameSelector from "./pages/Login/HostnameSelector.tsx";
import Login from "./pages/Login/Login.tsx";
import AuthGuardLayout from "./pages/AuthGuardLayout.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import Workouts from "./pages/Workouts.tsx";

const queryClient = new QueryClient()

function App() {
    return <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <Routes>
                <Route element={<AuthGuardLayout/>}>
                    <Route index element={<Workouts/>}/>
                    <Route path="auth" element={<LoginLayout/>}>
                        <Route path="set-hostname" element={<HostnameSelector/>}/>
                        <Route path="login" element={<Login/>}/>
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    </QueryClientProvider>
}

export default App
