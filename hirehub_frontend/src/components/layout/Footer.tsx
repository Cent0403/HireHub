import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-800 text-gray-300 px-20 py-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="text-blue-400 font-bold text-xl mb-4">HireHub</div>
          <p className="text-sm text-gray-400">
            Conectando talento con oportunidades. La plataforma líder para encontrar tu próximo empleo.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-3">Para Candidatos</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/jobs" className="hover:text-blue-400">Buscar Trabajos</Link></li>
            <li><Link to="/register" className="hover:text-blue-400">Crear Cuenta</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-3">Para Empresas</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/employer/dashboard" className="hover:text-blue-400">Dashboard</Link></li>
            <li><Link to="/register" className="hover:text-blue-400">Publicar Trabajo</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-3">Contacto</h3>
          <ul className="space-y-2 text-sm">
            <li>Email: info@hirehub.com</li>
            <li>Tel: +52 123 456 7890</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-gray-700 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} HireHub. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
