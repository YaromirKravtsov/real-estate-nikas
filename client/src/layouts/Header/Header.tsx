import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { Link } from "react-router-dom";
import { RouteNames } from "../../app/router";

type HeaderProps = {
  textColor?: string;
};

const Header: React.FC<HeaderProps> = ({ textColor = "#000" }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/search");
  };

  return (
    <header className={styles.header}>
      <Link to = '/' className={styles.logo} style={{ color: textColor }}>
        Nikas
      </Link>

      <nav className={styles.nav}>
         <Link
            to={RouteNames.NEW}
            className={styles.navItem}
            style={{ color: textColor, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Подати оголошення
          </Link>
      </nav>

      <button className={styles.button} onClick={handleNavigate}>
        Переглянути оголошення
        <span style={{ fontSize: '1.125rem' }}>→</span>
      </button>
    </header>
  );
};

export default Header;
