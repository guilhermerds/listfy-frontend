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
        <div className="flex flex-col mx-0 my-4">
            <label className="mb-2 text-left text-sm font-medium" htmlFor={name}>{label}</label>
            <div className="flex">
                {type === "money" && (
                    <div className="h-full p-3 rounded-l-2xl bg-secondary-light text-gray-400">R$</div>
                )}
                <input
                    name={name}
                    id="form-input"
                    className="main-input h-100% w-full p-3 border-0 rounded-2xl text-base bg-secondary-light
                        focus:outline-2 outline-primary placeholder:text-primary-light"
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
                        className="h-12 w-12 bg-secondary-light cursor-pointer border-0 flex justify-center items-center rounded-r-2xl"
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