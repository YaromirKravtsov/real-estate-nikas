import React, { useEffect, useState } from 'react';
import styles from './NavBar.module.css'
import CustomersIcon from '../../assets/svgs/CustomerIcon';
import { RouteNames } from '../../app/router';
import advIcon from '../../assets/images/advertisement.png'
import aiIcon from '../../assets/images/ai_chat.png'
import calendarIcon from '../../assets/images/calendar.png'
import usersIcon from '../../assets/images/users.png'



import { Link, useLocation } from 'react-router-dom';
import { useIsAdminPage } from '../../hooks/useIsInRoutes';


interface Props {
  className: string
}

interface NavLink {
  link: string,
  activate: boolean;
  text: string;
  icon: string
}

const NavBar: React.FC<Props> = ({ className }) => {
  const location = useLocation();

  const [navLinks, setNavLinks] = useState<NavLink[]>([
    {
      text: 'Оголошення',
      icon: advIcon,
      link: RouteNames.ADMIN_MAIN,
      activate: false
    },
    {
      text: 'AI-Чат Асистент',
      icon: aiIcon,
      link: RouteNames.ADMIN_MAIN,
      activate: false
    },

    {
      text: 'Заявки',
      icon: calendarIcon,
      link: RouteNames.ADMIN_MAIN,
      activate: false
    },
    {
      text: 'Співробітники',
      icon: usersIcon,
      link: RouteNames.USERS,
      activate: false
    },
  ])

  const activateNavElement = (link: string) => {
    setNavLinks(navLinks.map(nav => ({ ...nav, activate: link == nav.link })))
  }


  useEffect(() => {
    const path = window.location.pathname;
    const sectionFromUrl = '/' + path.split('/')[1];
    activateNavElement(sectionFromUrl)
    console.log(sectionFromUrl, navLinks)
  }, [location])

  return (
    <div className={`${className} ${styles.navBar}`}>
      {navLinks.map(navLink =>
        <Link
          key={navLink.link} to={navLink.link} className={`${styles.navLink} ${navLink.activate && styles.active}`}>
          <img src={navLink.icon} alt={navLink.text + " Icon"} />
          <p >{navLink.text}</p>
        </Link>
      )}
    </div>
  );
};

export default NavBar;