import { useState, useRef, useEffect, FC } from "react";
import styles from "./MySelect.module.css";
import arrowSelect from "../../assets/images/arrow-down-s-fill.svg";
import { SelectOption } from "../../models/SelectOption";

interface MySelectProps {
    options: SelectOption[];
    placeholder?: string;
    className?: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    value?: string;
    hasError?: boolean;
}

const MySelect: FC<MySelectProps> = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string | null>(props.value || null);
    const selectRef = useRef<HTMLDivElement>(null);
    const selectedOptionRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (props.value !== undefined) {
            setSelectedValue(props.value);
        }
    }, [props.value]);

    const handleOptionClick = (value: string, event: React.MouseEvent) => {
        event.stopPropagation(); // Предотвращаем всплытие
        event.preventDefault();
        setSelectedValue(value);
        props.onChange(value); // Уведомляем родителя о выборе
        setIsOpen(false);

        // Если есть ошибка, уведомляем родителя, что её нужно скрыть
        if (props.hasError) {
            props.onChange(value); // Колбэк обновляет родительское состояние ошибки
        }
    };

    const toggleDropdown = (event: React.MouseEvent) => {
        event.stopPropagation(); // Предотвращаем всплытие
        event.preventDefault();
        if (!props.disabled) {
            setIsOpen((prevState) => !prevState);
        }
    };

    // Прокручиваем к выбранному элементу, когда выпадающий список открывается
    useEffect(() => {
        if (isOpen && selectedOptionRef.current) {
            selectedOptionRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }, [isOpen]);

    const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div
            className={`${props.className || ""} ${styles.customSelectContainer} ${props.disabled ? styles.disabled : ""
                } `}
            ref={selectRef}
            onClick={(event) => event.stopPropagation()} // Останавливаем всплытие на основном контейнере
        >
            <div
                className={`${styles.customSelectTrigger} ${props.hasError ? styles.errorBorder : ""}`}
                onClick={toggleDropdown}
                style={{ cursor: props.disabled ? "not-allowed" : "pointer" }}
            >
                <span className={selectedValue ? styles.selectedPlaceholder : ""}>
                    {selectedValue
                        ? props.options.find((option) => option.value === selectedValue)?.label
                        : props.placeholder}
                </span>
                <svg className={`${styles.arrow} ${isOpen ? styles.open : ""}`} width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.0773 1H2.0052C1.1802 1 0.710076 1.94269 1.20644 2.60166L7.45807 10.9012C7.86668 11.4437 8.68561 11.4298 9.07556 10.8737L14.896 2.57418C15.3608 1.91148 14.8867 1 14.0773 1Z" fill="black" stroke="black" />
                </svg>
            </div>
            {isOpen && !props.disabled && (
                <div className={styles.customSelectDropdown}>
                    {props.options.map((option) => (
                        <div
                            key={option.value}
                            ref={option.value === selectedValue ? selectedOptionRef : null}
                            className={`${styles.customSelectOption} ${option.value === selectedValue ? styles.selectedOption : ""
                                }`}
                            onClick={(event) => handleOptionClick(option.value, event)}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
            {props.hasError && (
                <span className={styles.errorText}>Eingabefehler. Bitte überprüfen Sie die Daten.</span>
            )}
        </div>
    );
};

export default MySelect;
