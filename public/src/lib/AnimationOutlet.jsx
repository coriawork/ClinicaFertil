import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"

export function AnimatedOutlet() {
    const location = useLocation()
    const variants = {
        initial: { opacity: 0, x: 100 },
        in: { opacity: 1, x: 0 },
        out: { opacity: 0, x: -100 }
    }
    const transition = { duration: 0.35, ease: "anticipate" }

    return (
        <AnimatePresence mode="wait">
        <motion.div
            key={location.pathname}
            initial="initial"
            animate="in"
            exit="out"
            variants={variants}
            transition={transition}
            className="min-h-screen"
        >
            <Outlet />
        </motion.div>
        </AnimatePresence>
    )
}
