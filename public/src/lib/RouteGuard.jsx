import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export function RouteGuard({ role, children }) {
    const { user } = useAuth();
    const navigate = useNavigate();
/*     useEffect(() => {
        if (!user || user.role !== role) {
            navigate('/');
        }
    }, [user]);

    if (!user || user.role !== role) {
        return null;
    } */

    return children;
}