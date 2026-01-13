import { Clock, User, Bug, FolderKanban, UserPlus, AlertCircle } from 'lucide-react';

const ActivityFeed = ({ activities, loading }) => {
    const getActivityIcon = (type) => {
        const icons = {
        PROJECT_CREATED: FolderKanban,
        PROJECT_UPDATED: FolderKanban,
        MEMBER_ADDED: UserPlus,
        MEMBER_REMOVED: UserPlus,
        USER_JOINED_AS_TESTER: UserPlus,
        BUG_REPORTED: Bug,
        BUG_ASSIGNED: Bug,
        BUG_STATUS_CHANGED: Bug,
        BUG_RESOLVED: Bug,
        BUG_CLOSED: Bug,
        BUG_DELETED: Bug,
        };
        return icons[type] || AlertCircle;
    };

    const getActivityColor = (type) => {
        if (type.includes('PROJECT')) return 'bg-blue-100 text-blue-600';
        if (type.includes('MEMBER') || type.includes('USER')) return 'bg-purple-100 text-purple-600';
        if (type.includes('BUG')) return 'bg-red-100 text-red-600';
        return 'bg-gray-100 text-gray-600';
    };

    if (loading) {
        return (
        <div className="space-y-3">
            {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-lg p-4 h-20"></div>
            ))}
        </div>
        );
    }

    if (!activities || activities.length === 0) {
        return (
        <div className="text-center py-12 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No recent activity</p>
        </div>
        );
    }

    return (
        <div className="space-y-3">
        {activities.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            const colorClass = getActivityColor(activity.type);

            return (
            <div
                key={activity.id}
                className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition"
            >
                <div className={`w-10 h-10 rounded-lg ${colorClass} flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <User className="w-3 h-3" />
                    <span>{activity.user?.name || 'Unknown'}</span>
                    <span>•</span>
                    <Clock className="w-3 h-3" />
                    <span>{new Date(activity.createdAt).toLocaleString()}</span>
                </div>
                </div>
            </div>
            );
        })}
        </div>
    );
};

export default ActivityFeed;