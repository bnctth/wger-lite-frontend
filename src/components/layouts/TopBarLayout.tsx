import {Link, Outlet, useNavigate} from "react-router";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {eitherAsyncToQueryFn} from "../../utils.ts";
import IconButton from "../form/IconButton.tsx";
import {faRightFromBracket} from "@fortawesome/free-solid-svg-icons";
import {Context, createContext, useContext, useState} from "react";
import {ApiServiceContext, TokenServiceContext} from "../../services/Instances.ts";

/**
 * Context for setting the title of the page
 */
export const TitleContext = createContext(undefined) as unknown as Context<(title: string) => void>

/**
 * Layout for displaying a top bar with a title and a logout button
 * @constructor
 */
const TopBarLayout = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const apiService = useContext(ApiServiceContext)
    const tokenService = useContext(TokenServiceContext)

    const [title, setTitle] = useState('')

    const {data} = useQuery({
        queryKey: ['userProfile'],
        queryFn: eitherAsyncToQueryFn(apiService.userInfo())
    })

    return (
        <div className="h-full w-full pt-24">
            {data &&
                <div className="top-0 absolute w-full flex justify-between items-center p-6">
                    <Link to=".."><h1 className="text-2xl font-bold">{title}</h1></Link>
                    <div className="flex gap-6 items-center">
                        <span className="">{data.username}</span>
                        <IconButton icon={faRightFromBracket} onClick={async () => {
                            tokenService.logout()
                            await navigate('/auth/set-hostname')
                            await queryClient.invalidateQueries()
                        }}>Logout</IconButton>
                    </div>
                </div>
            }
            <TitleContext.Provider value={setTitle}>
                <Outlet/>
            </TitleContext.Provider>
        </div>
    );
};

export default TopBarLayout;