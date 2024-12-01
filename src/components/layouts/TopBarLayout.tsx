import {Outlet, useNavigate} from "react-router";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {eitherAsyncToQueryFn} from "../../utils.ts";
import IconButton from "../form/IconButton.tsx";
import {faRightFromBracket} from "@fortawesome/free-solid-svg-icons";
import {useContext} from "react";
import {ApiServiceContext, TokenServiceContext} from "../../services/Instances.ts";

const TopBarLayout = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const apiService = useContext(ApiServiceContext)
    const tokenService = useContext(TokenServiceContext)

    const {data} = useQuery({
        queryKey: ['userProfile'],
        queryFn: eitherAsyncToQueryFn(apiService.userInfo())
    })
    return (
        <div className="h-full w-full pt-24">
            {data &&
                <div className="top-0 absolute w-full flex justify-end items-center gap-6 p-6">
                    <span className="">{data.username}</span>
                    <IconButton icon={faRightFromBracket} onClick={async () => {
                        tokenService.logout()
                        await navigate('/auth/set-hostname')
                        await queryClient.invalidateQueries()
                    }}>Logout</IconButton>
                </div>
            }
            <Outlet/>
        </div>
    );
};

export default TopBarLayout;