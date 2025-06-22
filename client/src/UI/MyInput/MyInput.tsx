import { ChangeEvent, FC } from "react";
import styles from "./MyInput.module.css";

interface MyInputProps {
    value: string;
    setValue?: (value: string) => void;
    placeholder?: string;
    className?: string;
    width?: number;
    type?: string;
    disabled?: boolean;
    hasError?: boolean;
    onEnter?: () => void;
    onKeyDown?:(e: React.KeyboardEvent<HTMLInputElement>)=> void;
    onFocus?: ()=> void;
    name?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

const MyInput: FC<MyInputProps> = (props) => {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && props.onEnter) {
            props.onEnter(); // Вызываем переданную функцию
        }
    };

    return (
        <div className={`${styles.inputContainer} ${props.className}`}>
            <input
            name={props.name}
            onFocus={props.onFocus}
                onKeyDown={handleKeyDown}
                value={props.value}
                onChange={(e) => {props.setValue && props.setValue(e.target.value); props.onChange && props.onChange(e)}}
                placeholder={props.placeholder}
                className={`${props.className || ""} ${styles.input} ${props.disabled ? styles.disabled : ""
                    } ${props.hasError ? styles.errorBorder : ""}`} // Добавляем класс ошибки
                style={{
                    width: props.width ? `${props.width}px` : undefined,
                    color: props.type === 'datetime-local' && props.value === ''
                        ? 'rgba(0, 0, 0, 0.6)'
                        : 'rgba(0, 0, 0, 1)'
                }}
                type={props.type}
                disabled={props.disabled}
                
            />
            {props.hasError && (
                <span className={styles.errorText}>Eingabefehler. Bitte überprüfen Sie die Daten.</span>
            )}
        </div>
    );
};

export default MyInput;
