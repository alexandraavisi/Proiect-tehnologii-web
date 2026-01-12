import { useState, useEffect } from "react";
import {Link, useSearchParams} from 'react-router-dom';
import Layout  from "../../components/layout/Layout";
import {bugService} from '../../services/bugService';
import { projectService } from "../../services/projectService";
import { AlertCircle, Plus, Search, Filter, AlertTriangle, CheckCircle, Clock, User, Calendar } from "lucide-react";

const BugsPage = () => {
    const [searchParams] = useSearchParams();
    const projectId = searchParams.get('projectId');

    const [bugs, setBugs] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] =useState({
        projectId: projectId || '',
        status: '',
        severity: '',
        priority: '',
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const params = {};
            if (filters.projectId) {
            params.projectId = filters.projectId;
            }
            const [bugsData, projectsData] = await Promise.all([
                bugService.getAllBugs(params),
                projectService.getAllProjects(),
            ]);
            setBugs(bugsData.bugs || []);
            setProjects(projectsData.projects || []);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getSeverityColor = (severity) => {
        const colors = {
            CRITICAL: 'bg-red-100 text-red-800 border-red-200',
            HIGH: 'bg-orange-100 text-orange-800 border-orange-200',
            MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            LOW: 'bg-blue-100 text-blue-800 border-blue-200',
        };
        return colors[severity] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getStatusColor = (status) => {
        const colors = {
            REPORTED: 'bg-gray-100 text-gray-800',
            ASSIGNED: 'bg-blue-100 text-blue-800',
            IN_PROGRESS: 'bg-purple-100 text-purple-800',
            RESOLVED: 'bg-green-100 text-green-800',
            IN_TESTING: 'bg-yellow-100 text-yellow-800',
            CLOSED: 'bg-gray-200 text-gray-600',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };


    const filteredBugs = bugs.filter((bug) => {
        const matchesSearch =
            bug.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            bug.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !filters.status || bug.status === filters.status;
        const matchesSeverity = !filters.severity || bug.severity === filters.severity;
        const matchesPriority = !filters.priority || bug.priority === filters.priority;

        return matchesSearch && matchesStatus && matchesSeverity && matchesPriority;
    });

    if (loading) {
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
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Bugs</h1>
                    <p className="text-gray-600">Track and manage all bugs</p>
                </div>
                <Link
                    to="/bugs/new"
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                    <Plus className="w-5 h-5" />
                    Report Bug
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="lg:col-span-2">
            <           div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search bugs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <select
                        value={filters.projectId}
                        onChange={(e) => setFilters({ ...filters, projectId: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                        <option value="">All Projects</option>
                        {projects.map((project) => (
                            <option key={project.id} value={project.id}>
                                {project.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                        <option value="">All Status</option>
                        <option value="REPORTED">Reported</option>
                        <option value="ASSIGNED">Assigned</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="IN_TESTING">In Testing</option>
                        <option value="CLOSED">Closed</option>
                    </select>

                    <select
                        value={filters.severity}
                        onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                        <option value="">All Severity</option>
                        <option value="CRITICAL">Critical</option>
                        <option value="HIGH">High</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="LOW">Low</option>
                    </select>
                </div>
            </div>

            {filteredBugs.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No bugs found</h3>
                    <p className="text-gray-600 mb-6">
                        {searchTerm || Object.values(filters).some(Boolean)
                            ? 'Try adjusting your filters'
                            : 'Report your first bug to get started'}
                    </p>
                    {!searchTerm && !Object.values(filters).some(Boolean) && (
                        <Link
                            to="/bugs/new"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                            <Plus className="w-5 h-5" />
                            Report Bug
                        </Link>
                    )}
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredBugs.map((bug) => (
                        <Link
                            key={bug.id}
                            to={`/bugs/${bug.id}`}
                            className="block bg-white rounded-xl border border-gray-200 hover:border-red-300 hover:shadow-md transition p-6"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-bold text-gray-900">{bug.title}</h3>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(bug.severity)}`}>
                                            {bug.severity}
                                        </span>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(bug.status)}`}>
                                            {bug.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{bug.description}</p>
                                     <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <User className="w-3 h-3" />
                                                {bug.reporter?.user?.name || 'Unknown'}
                                        </span>
                                        {bug.assignee && (
                                            <span className="flex items-center gap-1">
                                                Assigned to: {bug.assignee.user?.name}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(bug.createdAt).toLocaleDateString()}
                                        </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        )}
    </Layout>
  );
};

export default BugsPage;
