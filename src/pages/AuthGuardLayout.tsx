import {Outlet, useLocation, useNavigate} from "react-router";
import {useEffect} from "react";
import {tokenService} from "../services/Instances.ts";

const AuthGuardLayout = () => {
    const location = useLocation()
    const navigate = useNavigate()
    useEffect(() => {
        if (location.pathname.startsWith('/auth/') && tokenService.isLoggedIn()) {
            navigate('/')
        } else if (!location.pathname.startsWith('/auth/') && !tokenService.isLoggedIn()) {
            navigate(('/auth/set-hostname'))
        }
    }, [location, navigate /* technically not necessary but without this I got a warning */])
    return <Outlet/>
}

export default AuthGuardLayout