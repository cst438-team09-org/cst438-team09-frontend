import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";


function Logout({ logout }) {

    const navigate = useNavigate();

    useEffect(() => {
        logout();
        navigate('/');
    })
}

export default Logout;