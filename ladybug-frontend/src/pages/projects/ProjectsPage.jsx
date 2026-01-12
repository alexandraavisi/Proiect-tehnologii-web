import { useState, useEffect } from "react";
import {Link} from 'react-router-dom';
import Layout from "../../components/layout/Layout";
import {projectService} from '../../services/projectService';
import {FolderKanban, Plus, Users, Bug, Calendar, Search, Filter, Globe, Lock} from 'lucide-react';

const ProjectsPage=() =>{
    const [projects, setProjects]= useState([]);
    const [loading, setLoading]= useState(true);
    const [searchTerm, setSearchTerm]= useState('');
    const [filter, setFilter]= useState('all');

    useEffect(()=>{
        loadProjects();
    },[]);

    const loadProjects= async ()=>{
        try{
            const data=await projectService.getAllProjects();
            setProjects(data.projects || []);
        }catch(error){
            console.error('Failed to load projects:', error);
        }finally{
            setLoading(false);
        }
    };

    const filteredProjects= projects.filter(project =>{
        const matchesSearch=project.name.toLowerCase().includes(searchTerm.toLowerCase()) || project.description?.toLowerCase().includes(searchTerm.toLowerCase());
        
        if(filter === 'creator') 
            return matchesSearch && project.membership?.isCreator;
        if(filter === 'member')
            return matchesSearch && !project.membership?.isCreator;
        return matchesSearch;
    });

    const ProjectCard=({project})=> (
        <Link to={`/projects/${project.id}`} className="block bg-white rounded-xl border border-gray-200 hover:border-red-300 hover:shadow-lg transition p-6">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                        <FolderKanban className="w-6 h-6 text-white"/>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            {project.isPublic? (
                                <span className="flex items-center gap-1">
                                    <Globe className="w-3 h-3"/>Public
                                </span>
                            ):(
                                <span className="flex items-center gap-1">
                                    <Lock className="w-3 h-3"/> Private
                                </span>
                            )}

                            {project.membership?.isCreator && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">Creator</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description || 'No description'}</p>

            <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" /> {project.memberCount || 0} members
                </span>
                <span className="flex items-center gap-1">
                    <Bug className="w-4 h-4"/> {project.bugCount || 0} bugs
                </span>
                <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4"/> {new Date(project.createdAt).toLocaleDateString()}
                </span>
            </div>
        </Link>
    );

    if(loading){
        return(
            <Layout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                </div>
            </Layout>
        );
    }

    return(
        <Layout>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
                    <p className="text-gray-600">Manage your bug tracking projects</p>
                </div>

                <Link to="/projects/new" className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                    <Plus className="w-5 h-5"/> New Project
                </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                    <input type="text" placeholder="Search projects..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"/>
                </div>
                <div className="flex gap-2">
                    <button onClick={()=> setFilter('all')} className={`px-4 py-2 rounded-lg transition ${filter === 'all' ? 'bg-red-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}> All </button>
                    <button onClick={()=> setFilter('creator')} className={`px-4 py-2 rounded-lg transition ${filter === 'creator' ? 'bg-red-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>Created by me</button>
                    <button onClick={()=> setFilter('member')} className={`px-4 py-2 rounded-lg transition ${filter === 'member' ? 'bg-red-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>Member</button>
                </div>
            </div>

            {filteredProjects.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <FolderKanban className="w-16 h-16 text-gray-400 mx-auto mb-4"/>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No projects found</h3>
                    <p className="text-gray-600 mb-6">
                        {searchTerm ? 'Try a different search term' : 'Get started by creating your first project'}
                    </p>
                    {!searchTerm && (
                        <Link to="/projects/new" className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                            <Plus className="w-5 h-5"/> Create Project
                        </Link>
                    )}
                </div>
            ):(
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project)=>(
                        <ProjectCard key={project.id} project={project}/>
                    ))}
                </div>
            )}
        </Layout>
    );
};

export default ProjectsPage;