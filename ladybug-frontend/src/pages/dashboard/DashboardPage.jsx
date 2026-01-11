import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from '../../components/layout/Layout';
import { FolderKanban, AlertCircle, Users, Activity, Plus, TrendingUp } from "lucide-react";
import api from '../../services/api';

const DashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const response = await api.get('/activities/my-stats');
            setStats(response.data.stats || {
            projects: { total: 0, asCreator: 0, asMember: 0 },
            bugs: { reported: 0, assigned: 0, resolved: 0 }
            });
        } catch (error) {
            console.error('Failed to load stats:', error);
            setStats({
            projects: { total: 0, asCreator: 0, asMember: 0 },
            bugs: { reported: 0, assigned: 0, resolved: 0 }
            });
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, icon: Icon, colorClass, subtitle }) => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
            <div className={colorClass}>
                <Icon className="w-6 h-6" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
    );

    if (loading || !stats) {
        return (
            <Layout>
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                <p className="text-gray-600">Overview of your projects and bugs</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <Link
                    to="/projects/new"
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 transition shadow-lg"
                >
                    <Plus className="w-6 h-6"/>
                    <div>
                        <p className="font-semibold">Create New Project</p>
                        <p className="text-sm text-red-100">Stat tracking bugs</p>
                    </div>
                </Link>
                <Link
                    to = "/bugs/new"
                    className="flex items-center gap-3 p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-red-300  hover:shadow-md transition"
                >
                    <AlertCircle className="w-6 h-6 text-red-600"/>
                    <div>
                        <p className="font-semibold text-gray-900">Report New Bug</p>
                        <p className="text-sm text-gray-600">Create bug report</p>
                    </div>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Projects"
                    value={stats.projects.total}
                    icon={FolderKanban}
                    colorClass="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600"
                    subtitle={`${stats.projects.asCreator} created, ${stats.projects.asMember} member`}
                />
                <StatCard
                    title="Reported Bugs"
                    value={stats.bugs.reported}
                    icon={AlertCircle}
                    colorClass="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center text-red-600"
                />
                <StatCard
                    title="Assigned to Me"
                    value={stats.bugs.assigned}
                    icon={Users}
                    colorClass="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600"
                />
                <StatCard
                    title="Resolved"
                    value={stats.bugs.resolved}
                    icon={Activity}
                    colorClass="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-green-600"
                />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                <div className="text-center py-12 text-gray-500">
                    <Activity className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>No recent activity</p>
                </div>
            </div>   
        </Layout>
    );
};

export default DashboardPage;