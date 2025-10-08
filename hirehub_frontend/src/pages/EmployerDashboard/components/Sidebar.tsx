import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
    name: string;
    icon: LucideIcon; 
    path: string;
    current?: boolean;
}

interface SidebarProps {
    navItems: NavItem[];
    onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ navItems, onLogout }) => {
    return (
        <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col justify-between">
            <div>
                <div className="text-2xl font-bold text-blue-600 mb-10">Hirehub</div> 
                
                <h3 className="text-xs font-semibold uppercase text-gray-400 mb-4">EMPLOYERS DASHBOARD</h3>
                
                <nav className="space-y-1">
                    {navItems.map(item => (
                        <Link 
                            key={item.name}
                            to={item.path}
                            className={`flex items-center p-3 rounded-lg text-sm font-medium transition-colors ${
                                item.current 
                                ? 'bg-blue-50 text-blue-600' 
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <item.icon className="w-5 h-5 mr-3" />
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </div>
            
            <div className="mt-8">
                <button 
                    onClick={onLogout}
                    className="flex items-center p-3 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors w-full"
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    Log-out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;