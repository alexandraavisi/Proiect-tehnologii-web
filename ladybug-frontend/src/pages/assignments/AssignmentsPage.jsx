import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { bugAssignmentService } from '../../services/bugAssignmentService';
import { Clock, CheckCircle, XCircle, AlertCircle, User, Calendar, MessageSquare } from 'lucide-react';

const AssignmentsPage = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending'); // pending, accepted, rejected, all
    const [actionLoading, setActionLoading] = useState(null);
    const [rejectReason, setRejectReason] = useState('');
    const [rejectingId, setRejectingId] = useState(null);

    useEffect(() => {
        loadAssignments();
    }, [filter]);

    const loadAssignments = async () => {
        setLoading(true);
        try {
        let data;
        if (filter === 'pending') {
            data = await bugAssignmentService.getMyPendingAssignments();
        } else if (filter === 'all') {
            data = await bugAssignmentService.getMyAssignments();
        } else {
            data = await bugAssignmentService.getMyAssignments(filter.toUpperCase());
        }
        setAssignments(data.assignments || []);
        } catch (error) {
        console.error('Failed to load assignments:', error);
        } finally {
        setLoading(false);
        }
    };

    const handleAccept = async (assignmentId) => {
        if (!window.confirm('Accept this bug assignment?')) return;

        setActionLoading(assignmentId);
        try {
        await bugAssignmentService.acceptAssignment(assignmentId);
        await loadAssignments();
        } catch (err) {
        alert(err.response?.data?.message || 'Failed to accept assignment');
        } finally {
        setActionLoading(null);
        }
    };

    const handleRejectClick = (assignmentId) => {
        setRejectingId(assignmentId);
        setRejectReason('');
    };

    const handleRejectSubmit = async (assignmentId) => {
        if (!rejectReason.trim()) {
        alert('Please provide a reason for rejection');
        return;
        }

        setActionLoading(assignmentId);
        try {
        await bugAssignmentService.rejectAssignment(assignmentId, rejectReason);
        setRejectingId(null);
        setRejectReason('');
        await loadAssignments();
        } catch (err) {
        alert(err.response?.data?.message || 'Failed to reject assignment');
        } finally {
        setActionLoading(null);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
        PENDING: 'bg-yellow-100 text-yellow-800',
        ACCEPTED: 'bg-green-100 text-green-800',
        REJECTED: 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusIcon = (status) => {
        const icons = {
        PENDING: Clock,
        ACCEPTED: CheckCircle,
        REJECTED: XCircle,
        };
        const Icon = icons[status] || AlertCircle;
        return <Icon className="w-5 h-5" />;
    };

    const pendingCount = assignments.filter(a => a.status === 'PENDING').length;
    const acceptedCount = assignments.filter(a => a.status === 'ACCEPTED').length;
    const rejectedCount = assignments.filter(a => a.status === 'REJECTED').length;

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
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Bug Assignments</h1>
            <p className="text-gray-600">Manage bugs assigned to you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
                <p className="text-sm text-gray-600">Pending</p>
                </div>
            </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                <p className="text-2xl font-bold text-gray-900">{acceptedCount}</p>
                <p className="text-sm text-gray-600">Accepted</p>
                </div>
            </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                <p className="text-2xl font-bold text-gray-900">{rejectedCount}</p>
                <p className="text-sm text-gray-600">Rejected</p>
                </div>
            </div>
            </div>
        </div>

        <div className="flex gap-2 mb-6">
            <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg transition ${
                filter === 'pending'
                ? 'bg-red-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
            >
            Pending ({pendingCount})
            </button>
            <button
            onClick={() => setFilter('accepted')}
            className={`px-4 py-2 rounded-lg transition ${
                filter === 'accepted'
                ? 'bg-red-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
            >
            Accepted ({acceptedCount})
            </button>
            <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded-lg transition ${
                filter === 'rejected'
                ? 'bg-red-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
            >
            Rejected ({rejectedCount})
            </button>
            <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition ${
                filter === 'all'
                ? 'bg-red-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
            >
            All
            </button>
        </div>

        {assignments.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No assignments found</h3>
            <p className="text-gray-600">
                {filter === 'pending' && "You don't have any pending assignments"}
                {filter === 'accepted' && "You haven't accepted any assignments yet"}
                {filter === 'rejected' && "You haven't rejected any assignments"}
                {filter === 'all' && "You don't have any assignments"}
            </p>
            </div>
        ) : (
            <div className="space-y-4">
            {assignments.map((assignment) => (
                <div
                key={assignment.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition"
                >
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <Link
                        to={`/bugs/${assignment.bug?.id}`}
                        className="text-lg font-bold text-gray-900 hover:text-red-600"
                        >
                        {assignment.bug?.title}
                        </Link>
                        <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(assignment.status)}`}>
                        {getStatusIcon(assignment.status)}
                        <span className="ml-1">{assignment.status}</span>
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{assignment.bug?.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Assigned by: {assignment.assigner?.user?.name}
                        </span>
                        <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(assignment.assignedAt).toLocaleDateString()}
                        </span>
                    </div>
                    </div>
                </div>

                {assignment.status === 'REJECTED' && assignment.rejectionReason && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 text-red-600 mt-0.5" />
                        <div>
                        <p className="text-xs font-medium text-red-800 mb-1">Rejection Reason:</p>
                        <p className="text-sm text-red-700">{assignment.rejectionReason}</p>
                        </div>
                    </div>
                    </div>
                )}

                {assignment.status === 'PENDING' && (
                    <div className="border-t border-gray-200 pt-4">
                    {rejectingId === assignment.id ? (
                        <div className="space-y-3">
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Provide a reason for rejection (10-500 characters)..."
                            rows={3}
                            minLength={10}
                            maxLength={500}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                        />
                        <div className="flex gap-2">
                            <button
                            onClick={() => handleRejectSubmit(assignment.id)}
                            disabled={actionLoading === assignment.id || rejectReason.length < 10}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                            {actionLoading === assignment.id ? 'Rejecting...' : 'Confirm Reject'}
                            </button>
                            <button
                            onClick={() => setRejectingId(null)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                            Cancel
                            </button>
                        </div>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                        <button
                            onClick={() => handleAccept(assignment.id)}
                            disabled={actionLoading === assignment.id}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <CheckCircle className="w-5 h-5" />
                            {actionLoading === assignment.id ? 'Accepting...' : 'Accept'}
                        </button>
                        <button
                            onClick={() => handleRejectClick(assignment.id)}
                            disabled={actionLoading === assignment.id}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <XCircle className="w-5 h-5" />
                            Reject
                        </button>
                        </div>
                    )}
                    </div>
                )}
                </div>
            ))}
            </div>
        )}
        </Layout>
    );
};

export default AssignmentsPage;