import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { bugService } from '../../services/bugService';
import { useAuth } from '../../context/AuthContext';
import AssignBugModal from '../../components/modals/AssignBugModal';
import { ArrowLeft, AlertCircle, User, Calendar, Github, CheckCircle, XCircle, AlertTriangle,Clock, Edit, Trash2} from 'lucide-react';

const BugDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [assignLoading, setAssignLoading] = useState(false);
    const [bug, setBug] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        loadBug();
    }, [id]);

    const loadBug = async () => {
        try {
        const data = await bugService.getBugById(id);
        setBug(data.bug);
        } catch (err) {
        setError(err.response?.data?.message || 'Failed to load bug');
        } finally {
        setLoading(false);
        }
    };

    const handleSelfAssign = async () => {
        if (!window.confirm('Do you want to self-assign this bug?')) return;
        
        setActionLoading(true);
        try {
        await bugService.selfAssignBug(id);
        await loadBug();
        } catch (err) {
        alert(err.response?.data?.message || 'Failed to self-assign');
        } finally {
        setActionLoading(false);
        }
    };

    const handleResolve = async () => {
        if (!window.confirm('Mark this bug as resolved?')) return;
        
        setActionLoading(true);
        try {
        await bugService.resolveBug(id);
        await loadBug();
        } catch (err) {
        alert(err.response?.data?.message || 'Failed to resolve bug');
        } finally {
        setActionLoading(false);
        }
    };

    const handleClose = async () => {
        if (!window.confirm('Close this bug? This action is final.')) return;
        
        setActionLoading(true);
        try {
        await bugService.closeBug(id);
        await loadBug();
        } catch (err) {
        alert(err.response?.data?.message || 'Failed to close bug');
        } finally {
        setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Delete this bug? This cannot be undone!')) return;
        
        setActionLoading(true);
        try {
        await bugService.deleteBug(id);
        navigate('/bugs');
        } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete bug');
        setActionLoading(false);
        }
    };

    const handleAssignBug = async (assigneeId) => {
        setAssignLoading(true);
        try {
            await bugService.assignBugToMember(id, assigneeId);
            await loadBug();
            setShowAssignModal(false);
        } catch (err) {
            throw err; 
        } finally {
            setAssignLoading(false);
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

    if (loading) {
        return (
        <Layout>
            <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        </Layout>
        );
    }

    if (error || !bug) {
        return (
        <Layout>
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
            <p className="text-red-800">{error || 'Bug not found'}</p>
            <button
                onClick={() => navigate('/bugs')}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
                Back to Bugs
            </button>
            </div>
        </Layout>
        );
    }

    const isAssignee = bug.assignee?.userId === user?.id;
    const canClose = bug.reporter?.userId === user?.id || bug.project?.creatorId === user?.id;

    return (
        <Layout>
        <button
            onClick={() => navigate('/bugs')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
            <ArrowLeft className="w-5 h-5" />
            Back to Bugs
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl font-bold text-gray-900">{bug.title}</h1>
                </div>
                <div className="flex items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-lg border text-sm font-medium ${getSeverityColor(bug.severity)}`}>
                    {bug.severity}
                </span>
                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(bug.status)}`}>
                    {bug.status.replace('_', ' ')}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                    Priority: {bug.priority}
                </span>
                </div>
            </div>

            <div className="flex gap-2">
                {bug.project?.membership?.isCreator && !bug.assigneeId && bug.status === 'REPORTED' && (
                    <button
                    onClick={() => setShowAssignModal(true)}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                    >
                    Assign to MP
                    </button>
                )}

                {!bug.assigneeId && bug.status === 'REPORTED' && (
                <button
                    onClick={handleSelfAssign}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    Self Assign
                </button>
                )}
                {isAssignee && bug.status !== 'RESOLVED' && bug.status !== 'CLOSED' && (
                <button
                    onClick={handleResolve}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                    Mark Resolved
                </button>
                )}
                {canClose && bug.status !== 'CLOSED' && (
                <button
                    onClick={handleClose}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
                >
                    Close
                </button>
                )}
            </div>
            </div>

            <div className="prose max-w-none mb-6">
            <p className="text-gray-700 whitespace-pre-wrap">{bug.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
            <div>
                <p className="text-sm text-gray-500 mb-1">Reported by</p>
                <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-gray-900">{bug.reporter?.user?.name}</span>
                </div>
            </div>

            {bug.assignee && (
                <div>
                <p className="text-sm text-gray-500 mb-1">Assigned to</p>
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">{bug.assignee.user?.name}</span>
                </div>
                </div>
            )}

            <div>
                <p className="text-sm text-gray-500 mb-1">Created</p>
                <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-gray-900">
                    {new Date(bug.createdAt).toLocaleDateString()}
                </span>
                </div>
            </div>

            {bug.githubCommitUrl && (
                <div>
                <p className="text-sm text-gray-500 mb-1">Related Commit</p>
                <a
                    href={bug.githubCommitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                    <Github className="w-4 h-4" />
                    <span className="font-medium">View Commit</span>
                </a>
                </div>
            )}
            </div>
        </div>

        {bug.project && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Project</h2>
            <Link
                to={`/projects/${bug.project.id}`}
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition"
            >
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                <p className="font-medium text-gray-900">{bug.project.name}</p>
                <p className="text-sm text-gray-600">{bug.project.description}</p>
                </div>
            </Link>
            </div>
        )}

        <AssignBugModal
            isOpen={showAssignModal}
            onClose={() => setShowAssignModal(false)}
            onAssign={handleAssignBug}
            members={bug.project?.members}
            loading={assignLoading}
        />

        </Layout>
    );
};

export default BugDetailsPage;