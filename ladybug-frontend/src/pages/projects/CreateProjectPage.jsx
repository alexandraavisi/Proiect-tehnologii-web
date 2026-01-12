import { useState } from "react";
import {useNavigate} from 'react-router-dom';
import Layout from "../../components/layout/Layout";
import { projectService } from "../../services/projectService";
import {FolderKanban, ArrowLeft, AlertCircle, Globe, Lock} from 'lucide-react';

const CreateProjectPage=() =>{
    const navigate= useNavigate();
    const [loading, setLoading]= useState('');
    const [error, setError] =useState('');
    const [formData, setFormData]= useState({name:'', description:'', repoUrl:'', isPublic:true,});

    const handleChange= (e)=>{
        const {name, value, type, checked} =e.target;
        setFormData({...formData, [name]:type === 'checkbox' ? checked :value,});
    };

    const handleSubmit= async (e)=>{
        e.preventDefault();
        setError('');
        setLoading(true);

        try{
            const response= await projectService.createProject(formData);

            navigate(`/projects/${response.project.id}`);
        }catch(err){
            setError(err.response?.data?.message || 'Failed to create project');
        }finally{
            setLoading(false);
        }
    };

    return(
        <Layout>
            <div className="max-w-3xl mx-auto">
                <button onClick={()=> navigate('/projects')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                    <ArrowLeft className="w-5 h-5"/> Back to Projects
                </button>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                            <FolderKanban className="w-6 h-6 text-white"/>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Create New Project</h1>
                            <p className="text-sm text-gray-600">Set up a new bug tracking project</p>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"/>
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Project Name
                                <span className="text-red-600">*</span>
                            </label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition" placeholder="My Awesome Project"/>
                        </div>

                        <div >
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:boreder-transparent outline-none transition resize-none" placeholder="Brief description of your project..."/>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Repository URL</label>
                            <input type="url" name="repoUrl" value={formData.repoUrl} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition" placeholder="https://github.com/username/repo"/>
                            <p className="text-xs text-gray-500 mt-1">Optional: Link to your GitHub repository</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
                            <div className="space-y-3">
                                <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-red-300 transition">
                                    <input type="radio" name="isPublic" checked={formData.isPublic===true} onChange={()=> setFormData({...formData, isPublic: true})} className="mt-1"/>
                                    <div>
                                        <div className="flex items-center gap-2 font-medium text-gray-900 mb-1">
                                            <Globe className="w-5 h-5"/> Public
                                        </div>
                                        <p className="text-sm text-gray-600">Anyoane can see this project and request to join as a tester</p>
                                    </div>
                                </label>
                                <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-red-300 transition">
                                    <input type="radio" name="isPublic" checked={formData.isPublic===false} onChange={()=> setFormData({...formData, isPublic:false})} className="mt-1"/>
                                    <div>
                                        <div className="flex items-center gap-2 font-medium text-gray-900 mb-1">
                                            <Lock className="w-5 h-5"/> Private
                                        </div>
                                        <p className="text-sm text-gray-600">Only invited members can see and access this project</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button type="submit" disabled={loading} className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 focus:ring-4 focus:ring-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition">
                                {loading ? 'Creating...': 'Create Project'}
                            </button>
                            <button type="button" onClick={()=> navigate('/projects')} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default CreateProjectPage;