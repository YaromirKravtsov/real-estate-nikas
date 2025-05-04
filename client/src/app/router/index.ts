import React from 'react';
import LoginPage from '../../pages/LoginPage/LoginPage';
import MainPage from '../../pages/MainPage/MainPage';
import AdminPage from '../../pages/AdminPage/AdminPage';

export interface IRoute {
  path: string;
  element: React.ComponentType;

}
export enum RouteNames {
  LOGIN = "/login",
  MAIN = "/",
}

export const adminRoutes: IRoute[] = [{
  path: RouteNames.MAIN, element: AdminPage
},
]

export const userRoutes: IRoute[] = [
  { path: RouteNames.MAIN, element: MainPage },
]

export const publicRoutes: IRoute[] = [
  { path: RouteNames.LOGIN, element: LoginPage },
  { path: RouteNames.MAIN, element: MainPage },
]