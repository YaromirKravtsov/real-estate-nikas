import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Footer.module.css";
import { Link } from "react-router-dom";
import { RouteNames } from "../../app/router";
import { useTranslations } from "../../store/translations";

type FooterProps = {
  textColor?: string;
};

const Footer: React.FC<FooterProps> = ({ textColor = "#000" }) => {
  const navigate = useNavigate();
  const { locale, setLocale, translations } = useTranslations();

  const handleNavigate = () => {
    navigate(RouteNames.NEW);
  };

  const handleLanguageChange = (lang: 'uk' | 'en') => {
    setLocale(lang);
  };

  const t = translations();

  return (
    <footer className={`${styles.footer} userFooter`}>
      <Link to="/" className={styles.logo} style={{ color: textColor }}>
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
        {t.postAd} <span style={{ fontSize: '1.125rem' }}>→</span>
      </button>

      <div className={styles.languageSelector}>
        <p style={{ color: textColor }}>{t.changeLanguage}</p>
        <div className={styles.languageButtons}>
          <button
            onClick={() => handleLanguageChange("uk")}
            className={locale === "uk" ? styles.selected : ""}
          >
            Українська
          </button>
          <button
            onClick={() => handleLanguageChange("en")}
            className={locale === "en" ? styles.selected : ""}
          >
            English
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
