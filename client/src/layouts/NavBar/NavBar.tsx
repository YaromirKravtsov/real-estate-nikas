import React, { useEffect, useState } from 'react';
import styles from './NavBar.module.css'
import CustomersIcon from '../../assets/svgs/CustomerIcon';
import { RouteNames } from '../../app/router';

import { Link, useLocation } from 'react-router-dom';


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
      text: 'Main',
      icon: 'https://cdn-icons-png.flaticon.com/512/25/25694.png',
      link: RouteNames.MAIN,
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