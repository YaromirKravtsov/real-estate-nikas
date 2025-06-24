import React from "react";
import LoginPage from "../../pages/LoginPage/LoginPage";
import MainPage from "../../pages/MainPage/MainPage";
import AdminPage from "../../pages/AdminPage/AdminPage";
import NewAnnouncementPage from "../../pages/NewAnnouncementPage/NewAnnouncementPage";
import SubmittedApplicationsPage from "../../pages/SubmittedApplicationsPage/SubmittedApplicationsPage";
import PublicationManagementPage from "../../pages/PublicationManagementPage/PublicationManagementPage";
import UserPage from "../../pages/UserPage/UserPage";
import UsersPage from "../../pages/UsersPage/UsersPage";
import PropertiesPage from "../../pages/PropertiesPage/PropertiesPage";
import PropertyPage from "../../pages/PropertyPage/PropertyPage";
import PropertiesSearchPage from "../../pages/PropertiesSearchPage/PropertiesSearchPage";
import DetailAnnouncementPage from "../../pages/DetailAnnouncementPage/DetailAnnouncementPage";

export interface IRoute {
  path: string;
  element: React.ComponentType;
}
export enum RouteNames {
  LOGIN = "/login",
  MAIN = "/",
  ADMIN_MAIN = "/admin",
  PROPERTY_DETEIL = "/property",
  NEW = "/create-from-user/property",
  APPLICATIONS = "/SubmittedApplicationsPage",
  PUBLICATION = "/admin-publicationManagementPage",
  USER = "/user",
  USERS = "/users",
  PROPERTIES = "/admin-properties",
  PROPERTY = "/admin-property",
  SEARCH = "/search",
}

export const adminRoutes: IRoute[] = [
  {
    path: RouteNames.ADMIN_MAIN,
    element: AdminPage,
  },
  {
    path: RouteNames.USERS,
    element: UsersPage,
  },
  {
    path: RouteNames.PUBLICATION,
    element: PublicationManagementPage,
  },
  {
    path: RouteNames.APPLICATIONS,
    element: SubmittedApplicationsPage,
  },
  {
    path: RouteNames.USER + "/:id",
    element: UserPage,
  },
  {
    path: RouteNames.USER,
    element: UserPage,
  },
  {
    path: RouteNames.PROPERTIES,
    element: PropertiesPage,
  },
  {
    path: RouteNames.PROPERTY + "/:id",
    element: PropertyPage,
  },
  {
    path: RouteNames.PROPERTY + "/:id",
    element: PropertyPage,
  },
  {
    path: RouteNames.PROPERTY,
    element: PropertyPage,
  },
];

export const userRoutes: IRoute[] = [
  { path: RouteNames.MAIN, element: MainPage },
];

export const publicRoutes: IRoute[] = [
  { path: RouteNames.LOGIN, element: LoginPage },
  { path: RouteNames.NEW, element: NewAnnouncementPage },
  { path: RouteNames.MAIN, element: MainPage },
  { path: RouteNames.PROPERTY_DETEIL + "/:id", element: DetailAnnouncementPage },
  { path: RouteNames.SEARCH, element: PropertiesSearchPage },
];
