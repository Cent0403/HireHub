import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function Header() { 
    const { isAuthenticated, user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success('Sesión cerrada correctamente');
        navigate('/');
    };

    return (
        <header className="w-full mx-auto bg-white px-20 py-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="text-blue-600 font-bold text-xl">HireHub</div>
            </div>
            <nav className="flex items-center gap-4">
                {isAuthenticated && user ? (
                    <>
                        <span className="text-sm text-gray-700">Hola, <span className="font-semibold">{user.usuario}</span></span>
                        {user.tipo === 'EMPRESA' && (
                            <Link 
                                to="/employer/dashboard" 
                                className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Dashboard
                            </Link>
                        )}
                        <button 
                            onClick={handleLogout}
                            className="text-sm text-red-600 hover:text-red-700"
                        >
                            Cerrar Sesión
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-sm text-blue-600">Log In</Link>
                        <Link to="/register" className="text-sm bg-blue-600 text-white px-4 py-2 rounded">Register</Link>
                    </>
                )}
            </nav>
        </header>
    );
}