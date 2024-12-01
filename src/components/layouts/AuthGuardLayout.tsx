import {Outlet, useLocation, useNavigate} from "react-router";
import {useContext, useEffect} from "react";
import {TokenServiceContext} from "../../services/Instances.ts";

const AuthGuardLayout = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const tokenService = useContext(TokenServiceContext)

    useEffect(() => {
        if (location.pathname.startsWith('/auth/') && tokenService.isLoggedIn()) {
            navigate('/')
        } else if (!location.pathname.startsWith('/auth/') && !tokenService.isLoggedIn()) {
            navigate(('/auth/set-hostname'))
        }
    }, [tokenService, location, navigate /* technically not necessary but without this I got a warning */])
    return <Outlet/>
}

export default AuthGuardLayout