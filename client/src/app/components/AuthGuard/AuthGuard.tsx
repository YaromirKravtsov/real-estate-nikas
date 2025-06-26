import React, { FC, ReactNode, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { RouteNames, publicRoutes } from '../../router';
import Loader from '../../../UI/Loader/Loader';
import { useAuthStore } from '../../store/auth';
import { useWindowWidth } from '../../../hooks/useWindowWidth';

interface AuthGuardProps {
    children: ReactNode;
}

const AuthGuard: FC<AuthGuardProps> = (props) => {
    const isAuth = useAuthStore(state => state.loggedIn);
    const isLoading = useAuthStore(state => state.isLoading);
    const setIsLoading = useAuthStore(state => state.setIsLoading);

    const role = useAuthStore(state => state.role);
    const checkAuth = useAuthStore(state => state.checkAuth);

    const width = useWindowWidth();
    const fetchCheckAuth = async() =>{
        const token = localStorage.getItem('token');
        if (token) {
            console.log(token);
            await checkAuth(); 
            await setIsLoading(false)
        }else{
            setIsLoading(false);
        }
        
    }
    useEffect(() => {
        fetchCheckAuth()
    }, []);

    useEffect(() => {
        console.log(isLoading, isAuth, role);
    }, [isAuth, role, isLoading]);

    if (isLoading) {
        return <Loader />;
    }
    
   

    return <>{props.children}</>;
};

export default AuthGuard;
