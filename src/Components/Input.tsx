import { useState } from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import "../Css/Input.css"

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
                <input
                    name={name}
                    className="main-input h-100% w-full"
                    type={inputType}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
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