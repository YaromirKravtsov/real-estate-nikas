
import { Link } from 'react-router-dom';
import styles from './Header.module.css'
import { RouteNames } from '../../app/router';
import { useAuthStore } from '../../app/store/auth';
export default function Header() {
    const { firstName, lastName, avatarLink, userId } = useAuthStore()
    return (
        <div className={styles.header}>
            
        </div>
    );
}