import LoginLayout from "./components/layouts/LoginLayout.tsx";
import {BrowserRouter, Route, Routes} from "react-router";
import HostnameSelector from "./pages/Login/HostnameSelector.tsx";
import Login from "./pages/Login/Login.tsx";
import AuthGuardLayout from "./components/layouts/AuthGuardLayout.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import Workouts from "./pages/Workouts.tsx";
import Index from "./pages/Index.tsx";
import TopBarLayout from "./components/layouts/TopBarLayout.tsx";
import ModalLayout from "./components/layouts/ModalLayout.tsx";

const queryClient = new QueryClient()

function App() {
    return <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <Routes>
                <Route element={<ModalLayout/>}>
                    <Route element={<AuthGuardLayout/>}>
                        <Route index element={<Index/>}/>
                        <Route path="auth" element={<LoginLayout/>}>
                            <Route path="set-hostname" element={<HostnameSelector/>}/>
                            <Route path="login" element={<Login/>}/>
                        </Route>
                        <Route path={"workouts"} element={<TopBarLayout/>}>
                            <Route index element={<Workouts/>}/>
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    </QueryClientProvider>
}

export default App
