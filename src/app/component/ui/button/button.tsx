import React from "react";
import './button.css';

type ButtonProps = {
    onClick: () => void;
    children: React.ReactNode;
};

const Button = ({onClick, children}: ButtonProps) => {
    return (
        <button className="btn" onClick={onClick}>
            {children}
        </button>
    );
};

export default Button;