import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect,useState } from "react";
import { Loader2 } from "lucide-react";
export function RouteGuard({ roles, children }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        setIsLoading(true);
        if (!user || !user.role || roles.includes(user.role) === false) {
            navigate('/');
        }
        setIsLoading(false);
    }, [user]);

    if (isLoading) {
        <Loader2 className="animate-spin mx-auto my-20" size={48}>

        </Loader2>
    }
    return children;
}