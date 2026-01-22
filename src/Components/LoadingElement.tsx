import { motion } from "motion/react"
import type { ComponentProps } from "react"

interface IProp extends ComponentProps<"button"> {
    priority: boolean
}

const LoadingElement = ({ priority, className }: IProp) => {
    return (
        <div className={`flex justify-center items-center rounded-lg ${className}`}>
            <motion.div
                className={`w-full h-full border-4 border-transparent ${priority ? 'border-t-secondary' : 'border-t-primary'} rounded-full will-change-transform`}
                animate={{ transform: "rotate(360deg)" }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />
        </div>
    )
}

export default LoadingElement