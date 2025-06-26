import { useEffect, useState } from "react";
import MyInput from "../../UI/MyInput/MyInput";
import styles from "./LoginPage.module.scss";
import MyButton from "../../UI/MyButton/MyButton";
import { useAuthStore } from "../../app/store/auth";
import { useNavigate } from "react-router-dom";
import { RouteNames } from "../../app/router";
/* import loginLogo from '../../assets/images/login-logo.png' */
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const login = useAuthStore((store) => store.login);
  const role = useAuthStore((store) => store.role);
  const error = useAuthStore((store) => store.authError);
  const navigate = useNavigate();
  useEffect(() => {
    if (role == "admin" || role == "user") {
      navigate(RouteNames.PROPERTIES);
    }
  }, [role]);

  const hendelLogin = async () => {
    try {
      await login(email, password);
    } catch (e: any) {}
  };
  return (
    <div className={styles.page}>
      <div className={styles.main}>
        
        <div className={styles.inputRow}>
          <div className={styles.title}>Пошта</div>
          <MyInput
            type="text"
            value={email}
            setValue={setEmail}
            placeholder="Введіть пошту"
          />
        </div>
        <div className={styles.inputRow}>
          <div className={styles.title}>Пароль</div>
          <MyInput
            type="password"
            value={password}
            setValue={setPassword}
            placeholder="Введіть пароль"
          />
          {error && (
            <div className={styles.error}>
              Ім’я користувача або пароль недійсні
            </div>
          )}
        </div>
        <MyButton onClick={hendelLogin}>Увійти</MyButton>
      </div>
    </div>
  );
};

export default LoginPage;
