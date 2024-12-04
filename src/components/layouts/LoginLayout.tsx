import {Outlet} from "react-router";

/**
 * Layout for the login pages
 */
const LoginLayout = () => {
    return <div className="flex min-h-dvh justify-center items-center bg-primary">
        <div
            className="bg-white w-full min-h-dvh md:w-4/12 md:min-h-0 rounded py-10 px-20 flex items-center flex-col gap-10 shadow">
            <h1 className="text-2xl">Login</h1>
            <Outlet/>
        </div>
    </div>
}


export default LoginLayout