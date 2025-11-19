import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function Header() { 
    const { isAuthenticated, user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        logout();
        toast.success('Sesión cerrada correctamente');
        navigate('/');
        setIsMenuOpen(false);
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        }
        
        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    const getDashboardLink = () => {
        if (user?.tipo === 'EMPRESA') return '/employer/dashboard';
        if (user?.tipo === 'CANDIDATO') return '/candidate/dashboard';
        return null;
    };

    return (
        <header className="w-full mx-auto bg-white px-20 py-6 flex items-center justify-between">
            <div className="flex items-center gap-8">
                <Link to="/" className="text-blue-600 font-bold text-xl">HireHub</Link>
                <div className="flex items-center gap-6">
                    <Link to="/jobs" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                        Trabajos
                    </Link>
                    <Link to="/forum" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                        Foro
                    </Link>
                </div>
            </div>
            <nav className="flex items-center gap-4">
                {isAuthenticated && user ? (
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                {user.usuario.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-gray-700">{user.usuario}</span>
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="16" 
                                height="16" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                                className={`transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
                            >
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                <div className="px-4 py-2 border-b border-gray-200">
                                    <p className="text-xs text-gray-500">Cuenta</p>
                                    <p className="text-sm font-semibold text-gray-900">{user.usuario}</p>
                                    <p className="text-xs text-gray-500 capitalize">{user.tipo.toLowerCase()}</p>
                                </div>
                                
                                {getDashboardLink() && (
                                    <Link
                                        to={getDashboardLink()!}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="3" width="7" height="7"></rect>
                                            <rect x="14" y="3" width="7" height="7"></rect>
                                            <rect x="14" y="14" width="7" height="7"></rect>
                                            <rect x="3" y="14" width="7" height="7"></rect>
                                        </svg>
                                        Dashboard
                                    </Link>
                                )}
                                
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                        <polyline points="16 17 21 12 16 7"></polyline>
                                        <line x1="21" y1="12" x2="9" y2="12"></line>
                                    </svg>
                                    Cerrar Sesión
                                </button>
                            </div>
                        )}
                    </div>
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