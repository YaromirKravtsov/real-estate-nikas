import React, { useEffect, useState } from "react";
import styles from "./NavBar.module.css";
import { RouteNames } from "../../app/router";
import { Link, useLocation } from "react-router-dom";

import {
  FaBullhorn,
  FaRobot,
  FaCalendarAlt,
  FaUsers,
  FaFileAlt,
} from "react-icons/fa";

import { useTranslations } from "../../store/translations";

interface Props {
  className: string;
}

interface NavLink {
  link: string;
  activate: boolean;
  text: string;
  icon: React.ElementType;
}


const NavBar: React.FC<Props> = ({ className }) => {
  const location = useLocation();
  const { translations } = useTranslations();

  const path = location.pathname;
  const sectionFromUrl = "/" + path.split("/")[1];

  const navLinks: NavLink[] = [
    {
      text: translations().announcement,
      icon: FaBullhorn as React.ElementType,
      link: RouteNames.PROPERTIES,
      activate: false,
    },
    {
      text: translations().applications,
      icon: FaCalendarAlt as React.ElementType,
      link: RouteNames.PUBLICATION,
      activate: false,
    },
    {
      text: translations().employees,
      icon: FaUsers as React.ElementType,
      link: RouteNames.USERS,
      activate: false,
    },
    {
      text: translations().clientApplications,
      icon: FaFileAlt as React.ElementType,
      link: RouteNames.APPLICATIONS,
      activate: false,
    },
  ].map((nav) => ({
    ...nav,
    activate: nav.link === sectionFromUrl,
  }));

  return (
    <div className={`${className} ${styles.navBar}`}>
      {navLinks.map((navLink) => {
        const Icon = navLink.icon;
        return (
          <Link
            key={navLink.link}
            to={navLink.link}
            className={`${styles.navLink} ${navLink.activate ? styles.active : ""}`}
          >
            <Icon size={24} color="#000" />
            <p>{navLink.text}</p>
          </Link>
        );
      })}
    </div>
  );
};


export default NavBar;
