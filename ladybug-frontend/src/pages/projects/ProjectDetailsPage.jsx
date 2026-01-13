import { useState, useEffect, use } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import {projectService} from '../../services/projectService';
import AddMemberModal from '../../components/modals/AddMemberModal';
import AssignBugModal from '../../components/modals/AssignBugModal';
import { ArrowLeft, Users, Bug, Settings, Plus, UserPlus, UserMinus, Globe, Lock, Github, Calendar, Crown, Shield, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { activityService } from '../../services/activityService';
import ActivityFeed from '../../components/ActivityFeed';

const ProjectDetailsPage = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {user} = useAuth();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [addMemberLoading, setAddMemberLoading] = useState(false);
    const [activities, setActivities] = useState([]);
    const [activitiesLoading, setActivitiesLoading] = useState(true);

    useEffect(() => {
        loadProject();
    }, [id]);

    const loadProject = async () => {
        try {
            const [projectData, activitiesData] = await Promise.all([
            projectService.getProjectById(id),
            activityService.getProjectActivities(id, 15)
            ]);
            
            setProject(projectData.project);
            setActivities(activitiesData.activities || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load project');
        } finally {
            setLoading(false);
            setActivitiesLoading(false);
        }
    };

    const handleAddMember = async (memberData) => {
    setAddMemberLoading(true);
    try {
        await projectService.addMember(id, memberData);
        await loadProject();
        setShowAddMemberModal(false);
    } catch (err) {
        throw err; 
    } finally {
        setAddMemberLoading(false);
    }
    };

    const handleRemoveMember = async (memberId, memberName) => {
    if (!window.confirm(`Remove ${memberName} from the project?`)) return;

    try {
        await projectService.removeMember(id, memberId);
        await loadProject();
    } catch (err) {
        alert(err.response?.data?.message || 'Failed to remove member');
    }
    };

    const handleJoinAsTester = async () => {
    if (!window.confirm('Join this project as a Tester?')) return;

    try {
        await projectService.joinAsTester(id);
        await loadProject();
    } catch (err) {
        alert(err.response?.data?.message || 'Failed to join project');
    }
    };

    if(loading) {
        return(
            <Layout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                </div>
            </Layout>
        );
    }

    if(error || !project) {
        return (
            <Layout>
                <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center" >
                    <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3"/>
                    <p className="text-red-800">{error || 'Project not found'}</p>
                    <button
                        onClick={() => navigate('/projects')}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        Back to Projects
                    </button>
                </div>
            </Layout>
        );
    }

    const isCreator = project.membership?.isCreator;

    console.log('Is Creator:', isCreator);      
    console.log('Project:', project);          
    console.log('Membership:', project.membership);  

    return(
        <Layout>
            <button
                onClick={() => navigate('/projects')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
            >
                <ArrowLeft className="w-5 h-5"/>
                Back to Projects
            </button>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                            <Bug className="w-8 h-8 text-white"/>
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
                                <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                                    {project.isPublic ? (
                                        <>
                                            <Globe className="w-4 h-4"/> Public
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="w-4 h-4"/> Private
                                        </>
                                    )}
                                </span>
                                {
                                    isCreator && (
                                        <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                                            <Crown className="w-4 h-4"/> Creator
                                        </span>
                                )}
                            </div>
                            <p className="text-gray-600 mb-3">{project.description ||'No description'}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                {project.repoUrl &&(
                                    <a
                                    href={project.repoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 hover:text-red-600"
                                    >
                                        <Github className="w-4 h-4"/>
                                        Repository
                                    </a>
                                )}
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4"/>
                                    Created {new Date(project.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                    {isCreator&& (
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                            <Settings className="w-5 h-5"/>
                            Settings
                        </button>
                    )}
                </div>
            </div>

            {project.isPublic && !project.membership && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-blue-900 mb-1">
                    Join this project
                    </h3>
                    <p className="text-sm text-blue-700">
                    This is a public project. You can join as a Tester to report and test bugs.
                    </p>
                </div>
                <button
                    onClick={handleJoinAsTester}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition whitespace-nowrap"
                >
                    <UserPlus className="w-5 h-5" />
                    Join as Tester
                </button>
                </div>
            </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-600"/>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{project.members?.length || 0}</p>
                            <p className="text-sm text-gray-600">Team Members</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <Bug className="w-5 h-5 text-red-600"/>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{project.bugs?.length||0}</p>
                            <p className="text-sm text-gray-600">Total Bugs</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-green-600"/>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {project.bugs?.filter(b => b.status === 'RESOLVED').length || 0}
                            </p>
                            <p className="text-sm text-gray-600">Resolved</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Team Members</h2>
                        {isCreator && (
                            <button
                                onClick={() => setShowAddMemberModal(true)}
                                className="flex items-center gap-2 px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                <UserPlus className="w-4 h-4" />
                                Add Member
                            </button>
                        )}
                    </div>

                    {project.members?.map((member) => (
                        <div
                            key={member.id}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                            <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                                {member.user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">{member.user.name}</p>
                                <p className="text-sm text-gray-500">{member.user.email}</p>
                            </div>
                            </div>
                            <div className="flex items-center gap-2">
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                member.role === 'MP'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-green-100 text-green-700'
                                }`}
                            >
                                {member.role === 'MP' ? 'Membru' : 'Tester'}
                            </span>
                            {member.isCreator && (
                                <Crown className="w-4 h-4 text-yellow-500" />
                            )}
                            {isCreator && !member.isCreator && (
                                <button
                                onClick={() => handleRemoveMember(member.id, member.user.name)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                title="Remove member"
                                >
                                <UserMinus className="w-4 h-4" />
                                </button>
                            )}
                            </div>
                        </div>
                        ))}
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <Link
                            to={`/bugs/new?projectId=${id}`}
                            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition"
                        >
                            <Plus className="w-5 h-5 text-red-600"/>
                            <span className="font-medium text-gray-900">Report Bug</span>
                        </Link>
                        <Link
                            to={`/bugs?projectId=${id}`}
                            className="flex items-center gap-3 p-4 border border-gray-200  rounded-lg hover:border-red-300 hover:bg-red-50 transition"
                        >
                            <Bug className="w-5 h-5 text-red-600"/>
                            <span className="font-medium text-gray-900 ">View All Bugs</span>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                <ActivityFeed activities={activities} loading={activitiesLoading} />
            </div>

            <AddMemberModal
                isOpen={showAddMemberModal}
                onClose={() => setShowAddMemberModal(false)}
                onAdd={handleAddMember}
                loading={addMemberLoading}
            />
        </Layout>
    );
};

export default ProjectDetailsPage;