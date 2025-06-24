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

import { IconType } from "react-icons";

interface Props {
  className: string;
}

interface NavLink {
  link: string;
  activate: boolean;
  text: string;
  icon: IconType;
}

const NavBar: React.FC<Props> = ({ className }) => {
  const location = useLocation();

  const [navLinks, setNavLinks] = useState<NavLink[]>([
    {
      text: "Оголошення",
      icon: FaBullhorn,
      link: RouteNames.PROPERTIES,
      activate: false,
    },
   /*  {
      text: "AI-Чат Асистент",
      icon: FaRobot,
      link: RouteNames.ADMIN_MAIN,
      activate: false,
    }, */
    {
      text: "Заявки",
      icon: FaCalendarAlt,
      link: RouteNames.PUBLICATION,
      activate: false,
    },
    {
      text: "Співробітники",
      icon: FaUsers,
      link: RouteNames.USERS,
      activate: false,
    },
    {
      text: "Заявки клієнтів",
      icon: FaFileAlt,
      link: RouteNames.APPLICATIONS,
      activate: false,
    },
  ]);

  const activateNavElement = (link: string) => {
    setNavLinks(
      navLinks.map((nav) => ({ ...nav, activate: nav.link === link }))
    );
  };

  useEffect(() => {
    const path = window.location.pathname;
    const sectionFromUrl = "/" + path.split("/")[1];
    activateNavElement(sectionFromUrl);
  }, [location]);

  return (
    <div className={`${className} ${styles.navBar}`}>
      {navLinks.map((navLink) => {
        const Icon = navLink.icon as React.ComponentType<{
          size?: number;
          color?: string;
        }>;
        return (
          <Link
            key={navLink.link}
            to={navLink.link}
            className={`${styles.navLink} ${
              navLink.activate ? styles.active : ""
            }`}
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
