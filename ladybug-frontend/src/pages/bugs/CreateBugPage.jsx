import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { bugService } from '../../services/bugService';
import { projectService } from '../../services/projectService';
import { AlertCircle, ArrowLeft, AlertTriangle } from 'lucide-react';

const CreateBugPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const projectIdFromUrl = searchParams.get('projectId');
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({projectId: projectIdFromUrl || '', title: '', description: '', severity: 'MEDIUM', priority: 'MEDIUM', githubCommitUrl: '',});

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const data = await projectService.getAllProjects();
            setProjects(data.projects || []);
        } catch (error) {
            console.error('Failed to load projects:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await bugService.createBug(formData);
            navigate(/bugs/${response.bug.id});
        }catch(err) {
            setError(err.response?.data?.message || 'Failed to create bug');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={() => navigate('/bugs')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                        <ArrowLeft className="w-5 h-5" />Back to Bugs
                </button>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                            <AlertCircle className="w-6 h-6 text-white" />
                        </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Report New Bug</h1>
                        <p className="text-sm text-gray-600">Describe the bug you encountered</p>
                    </div>
                </div>
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Project <span className="text-red-600">*</span>
                        </label>
                        <select name="projectId" value={formData.projectId} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                            <option value="">Select a project</option>
                                {projects.map((project) => (
                                <option key={project.id} value={project.id}>
                                {project.name}
                            </option>
                            ))}
                        </select>
                    </div>
                
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bug Title <span className="text-red-600">*</span>
                        </label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required minLength={5} maxLength={300} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Brief description of the bug"/>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description <span className="text-red-600">*</span>
                        </label>
                        <textarea name="description" value={formData.description} onChange={handleChange} required rows={6} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none" placeholder="Detailed description of the bug, steps to reproduce, expected vs actual behavior..."/>
                     </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Severity <span className="text-red-600">*</span>
                            </label>
                            <select name="severity" value={formData.severity} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="CRITICAL">Critical</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-1">Impact on functionality</p>
                        </div>

                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                 Priority <span className="text-red-600">*</span>
                            </label>
                            <select name="priority" value={formData.priority} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-1">Urgency to fix</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            GitHub Commit URL (Optional)
                        </label>
                    <input type="url" name="githubCommitUrl" value={formData.githubCommitUrl} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="https://github.com/user/repo/commit/..."/>
                    <p className="text-xs text-gray-500 mt-1">Link to the commit that introduced the bug (if known)</p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="submit" disabled={loading} className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 focus:ring-4 focus:ring-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition">
                            {loading ? 'Reporting...' : 'Report Bug'}
                        </button>
                        <button type="button" onClick={() => navigate('/bugs')} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    </Layout>
  );
};

export default CreateBugPage;
