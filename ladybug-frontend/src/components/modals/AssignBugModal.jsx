import { useState } from 'react';
import { X, UserPlus, AlertCircle } from 'lucide-react';

const AssignBugModal = ({ isOpen, onClose, onAssign, members, loading }) => {
    const [selectedMemberId, setSelectedMemberId] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!selectedMemberId) {
        setError('Please select a member');
        return;
        }

        try {
        await onAssign(selectedMemberId);
        setSelectedMemberId('');
        onClose();
        } catch (err) {
        setError(err.response?.data?.message || 'Failed to assign bug');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Assign Bug</h2>
            </div>
            <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
                <X className="w-5 h-5 text-gray-500" />
            </button>
            </div>

            {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
            </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Member
                </label>
                <select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                <option value="">Choose a member...</option>
                {members
                    ?.filter((m) => m.role === 'MP') // Only MPs can be assigned
                    ?.map((member) => (
                    <option key={member.id} value={member.id}>
                        {member.user.name} ({member.user.email}) - {member.role}
                    </option>
                    ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                Only Project Managers (MP) can be assigned bugs
                </p>
            </div>

            <div className="flex gap-3 pt-2">
                <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                {loading ? 'Assigning...' : 'Assign Bug'}
                </button>
                <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                Cancel
                </button>
            </div>
            </form>
        </div>
        </div>
    );
};

export default AssignBugModal;