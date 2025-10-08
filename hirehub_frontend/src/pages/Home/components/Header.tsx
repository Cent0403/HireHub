import { Link } from "react-router-dom";

export default function Header() { 
    return (
        <header className="w-full mx-auto bg-white px-20 py-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
            <div className="text-blue-600 font-bold text-xl">HireHub</div>
            </div>
            <nav className="flex items-center gap-4">
            <Link to="/login" className="text-sm text-blue-600">Log In</Link>
            <Link to="/register" className="text-sm bg-blue-600 text-white px-4 py-2 rounded">Register</Link>
            </nav>
        </header>
    );
}