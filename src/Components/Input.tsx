import { useState } from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import "../Css/Input.css"
import formatCurrency from "../Utils/Currency";

type InputProps = {
    label: string;
    type: string;
    name: string;
    value?: string;
    setValue: (value: string) => void;
    placeholder?: string;
}

const Input = ({ label, name, type, placeholder, value, setValue }: InputProps) => {
    const [inputType, setInputType] = useState(type);

    return (
        <div className="form-input">
            <label htmlFor={name}>{label}</label>
            <div className="input-wrapper">
                {type === "money" && (
                    <div className="h-full p-3 rounded-l-2xl bg-secondary-light text-gray-400">R$</div>
                )}
                <input
                    name={name}
                    className="main-input h-100% w-full p-3 border-0 rounded-2xl text-base bg-secondary-light"
                    type={inputType === "money" ? "tel" : inputType}
                    placeholder={placeholder}
                    value={value}
                    inputMode={inputType === "money" || inputType === "number" ? "numeric" : "text"}
                    onChange={(e) => {
                        let newValue = e.target.value;

                        if (inputType === "money") {
                            newValue = formatCurrency(newValue);
                        }
                        setValue(newValue)
                    }}
                />
                {type === "password" && (
                    <button
                        type="button"
                        className="eye-icon"
                        onClick={() => {
                            if (inputType === "password")
                                setInputType("text");
                            else
                                setInputType("password");
                        }}
                    >
                        {inputType === "password" ? (
                            <VisibilityOffIcon />
                        ) : (
                            <VisibilityIcon />
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}

export default Input;