import {useNavigate} from "react-router";
import {useEffect} from "react";

/**
 * Index page - redirect to /workouts
 *
 * Path: /
 */
const Index = () => {
    const navigate = useNavigate()
    useEffect(() => {
        navigate('/workouts', {replace: true})
    })
    return <></>;
};

export default Index;