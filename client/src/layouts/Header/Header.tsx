import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { Link } from "react-router-dom";
import { RouteNames } from "../../app/router";
import { useTranslations } from "../../store/translations";

type HeaderProps = {
  textColor?: string;
};

const Header: React.FC<HeaderProps> = ({ textColor = "#000" }) => {
  const navigate = useNavigate();
  const { locale, translations } = useTranslations();

  const handleNavigate = () => {
    navigate(RouteNames.NEW);
  };

  const t = translations();

  return (
    <header className={`${styles.header} userHeader`}>
      <Link to = '/' className={styles.logo} style={{ color: textColor }}>
        Nikas
      </Link>

      <nav className={styles.nav}>
         <Link
            to={RouteNames.SEARCH}
            className={styles.navItem}
            style={{ color: textColor, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {t.searchProperty}
          </Link>
      </nav>

      <button className={styles.button} onClick={handleNavigate}>
        {t.postAd}
        <span style={{ fontSize: '1.125rem' }}>→</span>
      </button>
    </header>
  );
};

export default Header;
