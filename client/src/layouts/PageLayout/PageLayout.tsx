import React, { ReactNode } from 'react';
import styles from './PageLayout.module.css'
import MyButton from '../../UI/MyButton/MyButton';
import { useNavigate } from 'react-router-dom';
import RemoveButton from '../../UI/RemoveButton/RemoveButton';
interface Props {
    actionTitle: string,
    action: () => void;
    children: ReactNode;
    pageTitle: string;
    goBack?: boolean;
    removeAction?: () => void
}

const PageLayout: React.FC<Props> = ({ actionTitle, action, children, pageTitle, goBack, removeAction }) => {
    const navigate = useNavigate()
    return (
        <div className={styles.page}>
            <div className={styles.top}>
                <h1 className='pageTitle'>{pageTitle}</h1>
                <div className={styles.buttonRow}>
                    {
                        removeAction &&
                        <RemoveButton action={removeAction} />
                    }
                    {goBack &&
                        <MyButton className={`${styles.topButton} ${styles.goBack}`} onClick={() => navigate(-1)}>
                            Abbrechen
                        </MyButton>
                    }
                    <MyButton className={styles.topButton} onClick={action}>
                        {actionTitle}
                    </MyButton>
                </div>

            </div>
            <div className={styles.main}>
                {children}
            </div>
        </div>
    );
};

export default PageLayout;