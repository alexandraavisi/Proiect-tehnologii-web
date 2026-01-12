import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { bugService } from '../../services/bugService';
import { useAuth } from '../../context/AuthContext';
import {AlertCircle, Clock, CheckCircle, User, Calendar, Filter} from 'lucide-react';

const MyBugsPage =()=>{
    const { user } = useAuth();
    const [bugs, setBugs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('assigned'); 

    useEffect(() => {
        loadBugs();
    }, []);

    const loadBugs = async () => {
        try {
        const data = await bugService.getAllBugs();
        setBugs(data.bugs || []);
        } catch (error) {
        console.error('Failed to load bugs:', error);
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
        if (filter === 'assigned') {
            return bug.assignee?.userId === user?.id;
        }
        if (filter === 'reported') {
            return bug.reporter?.userId === user?.id;
        }
        return bug.assignee?.userId === user?.id || bug.reporter?.userId === user?.id;
    });

    const assignedCount = bugs.filter(b => b.assignee?.userId === user?.id).length;
    const reportedCount = bugs.filter(b => b.reporter?.userId === user?.id).length;

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
            </Layout>
        );
    };

    return (
    <Layout>
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bugs</h1>
            <p className="text-gray-600">Bugs assigned to you or reported by you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{assignedCount}</p>
                        <p className="text-sm text-gray-600">Assigned to Me</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <User className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{reportedCount}</p>
                        <p className="text-sm text-gray-600">Reported by Me</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">
                            {filteredBugs.filter(b => b.status === 'RESOLVED' || b.status === 'CLOSED').length}
                        </p>
                        <p className="text-sm text-gray-600">Resolved/Closed</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex gap-2 mb-6">
            <button onClick={() => setFilter('assigned')} className={`px-4 py-2 rounded-lg transition ${ filter === 'assigned' ? 'bg-red-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50' }`}> Assigned to Me ({assignedCount})</button>
            <button onClick={() => setFilter('reported')} className={`px-4 py-2 rounded-lg transition ${ filter === 'reported' ? 'bg-red-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50' }`}> Reported by Me ({reportedCount})</button>
            <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg transition ${ filter === 'all' ? 'bg-red-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50' }`}> All My Bugs ({assignedCount + reportedCount})</button>
        </div>

        {filteredBugs.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No bugs found</h3>
                <p className="text-gray-600">
                    {filter === 'assigned' && "You don't have any bugs assigned to you yet"}
                    {filter === 'reported' && "You haven't reported any bugs yet"}
                    {filter === 'all' && "You don't have any bugs"}
                </p>
            </div>
        ) : (
            <div className="space-y-3">
                {filteredBugs.map((bug) => (
                    <Link key={bug.id} to={`/bugs/${bug.id}`} className="block bg-white rounded-xl border border-gray-200 hover:border-red-300 hover:shadow-md transition p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-bold text-gray-900">{bug.title}</h3>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(bug.severity)}`}>{bug.severity}</span>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(bug.status)}`}>{bug.status.replace('_', ' ')}</span>
                                </div>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{bug.description}</p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <User className="w-3 h-3" />
                                        Reporter: {bug.reporter?.user?.name || 'Unknown'}
                                    </span>
                                    {bug.assignee && (
                                        <span className="flex items-center gap-1">Assignee: {bug.assignee.user?.name}</span>)}
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />{new Date(bug.createdAt).toLocaleDateString()}
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

export default MyBugsPage;