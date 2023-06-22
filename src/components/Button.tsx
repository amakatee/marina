import type {DetailedHTMLProps, ButtonHTMLAttributes} from 'react'

type ButtonProps = {
    small?: boolean,
    className?:string
} & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>

export function Button({small=false, className="", ...props} : ButtonProps) {
    const sizeClasses = small ? "px-2 py-1" : "px-4 py-2 font-bold" 
    return <button className={`rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${sizeClasses}`} {...props}></button>
}