import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { UserDataContext } from '../context/UserContext';
import axios from 'axios';
import { GFG_ROUTES } from '../gfgRoutes/gfgRoutes';
const UserProtectedWrapper = ({children}) => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const {user, setUser} = useContext(UserDataContext);
    console.log(user);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(()=>{
        if(!token){
            navigate("/login");
        }
        axios.get(`${GFG_ROUTES.GETUSER}`,{
            headers:{Authorization: `Bearer ${token}`}
        }).then(response =>{
            if(response.status === 200){
                console.log(" response from procted user", response);
                setUser(response.data);
                setIsLoading(false)
            }
        }).catch(err=>{
            console.error(err)
            localStorage.removeItem("token");
            navigate("/login");
        })
       
    },[token])
    if(isLoading){
         return ( <div> Loading....</div>)
    }
 return <>{children}</>;

}

export default UserProtectedWrapper
