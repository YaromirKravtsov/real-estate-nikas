import React, { FC, ReactNode, MouseEvent } from 'react';
import styles from './MyButton.module.css';

interface MyButtonProps {
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

const MyButton: FC<MyButtonProps> = ({ onClick, children, className, disabled }) => {
  return (
    <button
      className={`${styles.button} ${className || ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default MyButton;
