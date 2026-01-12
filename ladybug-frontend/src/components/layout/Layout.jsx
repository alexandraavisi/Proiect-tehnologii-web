import { useState } from "react";
import {Link, useLocation, useNavigate} from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import {Bug, LayoutDashboard, FolderKanban, AlertCircle, LogOut, Menu, X, User, Bell} from 'lucide-react';

const Layout =({children}) =>{
    const {user, logout}=useAuth();
    const location =useLocation();
    const navigate= useNavigate();
    const [sidebarOpen, setSidebarOpen]= useState(false);

    const navigation = [{name: 'Dashboard', href:'/dashboard', icon:LayoutDashboard},
        {name:'Projects', href:'/projects', icon:FolderKanban},
        {name: 'My Bugs', href:'/bugs', icon:AlertCircle},
    ];

    const handleLogout=() =>{
        logout();
        navigate('/login');
    };

    return(
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <button onClick={()=> setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">{sidebarOpen ? <X className="w-6 h-6"/>:<Menu className="w-6 h-6"/>}</button>
                            <Link to="/dashboard" className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                                    <Bug className="w-6 h-6 text-white"/>
                                </div>
                                <span className="text-xl font-bold text-gray-900 hidden sm:block">LadyBug</span>
                            </Link>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                                <Bell className="w-5 h-5 text-gray-600"/>
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                            <div className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-white"/>
                                </div>
                                <div className="hidden md:block">
                                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                    <p className="text-xs text-gray-900">{user?.email}</p>
                                </div>
                            </div>
                            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                                <LogOut className="w-4 h-4"/>
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:flex flex-col`}>
                    <nav className="flex-1 p-4 space-y-1 mt-16 lg:mt-0">
                        {navigation.map((item)=>{
                            const isActive= location.pathname===item.href;
                            return(
                                <Link key={item.name} to={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive ? 'bg-red-50 text-red-700 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}>
                                    <item.icon className="w-5 h-5"/>{item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                {sidebarOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={()=> setSidebarOpen(false)}/>
                )}

                <main className="flex-1 p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;