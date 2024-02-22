import { createContext, useContext, useEffect, useState} from "react";
import axios from "../api/axios";
import {useNavigate} from "react-router-dom";


const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const csrf = () => axios.get("/sanctum/csrf-cookie");
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();

    const getUser = async () => {
       const { data } = await axios.get('/api/user');
        setUser(data);
    };

    const login = async ({...data}) => {
        await csrf();
        setErrors([]);
        try{
            
            const res = await axios.post("/login", data);
            console.log(res);
            await getUser();
            navigate("/");
        }catch (e)
        {
            if(e.response.status === 422){
                setErrors(e.response.data.errors);
            }
        }


    };

    const register = async ({...data}) => {
        await csrf();
        setErrors([]);
        try{
            
            await axios.post("/register", data);
            await getUser();
            navigate("/login");
        }catch (e)
        {
            if(e.response.status === 422){
                setErrors(e.response.data.errors);
            }
        }


    };

    const logout = () =>{
        axios.post('/logout').then(()=>{
            setUser(null);
        });
    }



    return <AuthContext.Provider value={{user, errors, getUser, login, register, logout, csrf}}>
        {children}
    </AuthContext.Provider>



}

export default function useAuthContext(){
    return useContext(AuthContext);
}