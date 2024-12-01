import {useNavigate} from "react-router";
import {useEffect} from "react";

const Index = () => {
    const navigate = useNavigate()
    useEffect(() => {
        navigate('/workouts', {replace: true})
    })
    return <></>;
};

export default Index;