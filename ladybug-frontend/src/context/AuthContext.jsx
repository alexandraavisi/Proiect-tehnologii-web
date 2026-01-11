import { createContext, useContext, useState, useEffect} from "react";
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({children}) =>{
    const [user, setUser]= useState(null);
    const [loading, setLoading]= useState(true);

    useEffect(()=>{
        const token = localStorage.getItem('token');
        const savedUser= localStorage.getItem('user');

        if(token && savedUser){
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login= async(email, password)=>{
        const response= await api.post('/auth/login', {email, password});
        const {token, user}= response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);

        return response.data;
    };

    const register= async (name, email, password)=>{
        const response= await api.post('/auth/register', {name, email, password});
        const {token, user}= response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);

        return response.data;
    };

    const logout=() =>{
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = ()=>{
        const context = useContext(AuthContext);
        if(!context){
            throw new Error('useAuth must be used within AuthProvider');
        }
        return context;
};