
import { Link } from 'react-router-dom';
import styles from './AdminHeader.module.css'
import { RouteNames } from '../../app/router';
import { useAuthStore } from '../../app/store/auth';
import { useTranslations } from '../../store/translations';
export default function Header() {
    const { firstName, lastName, profileImageUrl, userId, role } = useAuthStore()
    const {} = useTranslations()
    return (
        <div className={styles.header}>
            <Link to = '/' className={styles.logo}>
                Nikas
            </Link>
            <Link to = {RouteNames.USER + '/' + userId} className={styles.profile}>
                <div className={styles.col}>
                    <h3>
                        {firstName} {lastName}
                    </h3>
                    <p>
                        {role}
                    </p>
                </div>
                
                <img src={profileImageUrl} alt="" />
            </Link>
        </div>
    );
}