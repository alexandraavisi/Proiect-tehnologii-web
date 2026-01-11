import { useState } from "react";
import {useNavigate, Link} from 'react-router-dom';
import {useAuth} from '../../context/AuthContext';
import {Bug, Mail, Lock, User, AlertCircle} from 'lucide-react';

const RegisterPage=() =>{
    const navigate= useNavigate();
    const {register} =useAuth();
    const [formData, setFormData]= useState({name:'',email:'', password:'', confirmPassword:''});
    const [error, setError] =useState('');
    const [loading, setLoading]= useState(false);

    const handleSubmit= async (e)=>{
        e.preventDefault();
        setError('');

        if(formData.password !== formData.confirmPassword){
            setError('Passwords do not match');
            return;
        }

        if(formData.password.length<8){
            setError('Password must be at least 8 characters');
            return;
        }

        setLoading(true);

        try{
            await register(formData.name, formData.email, formData.password);
            navigate('/dashboard');
        }catch(err){
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        }finally{
            setLoading(false);
        }
    };

    const handleChange= (e)=>{
        setFormData({...formData, [e.target.name]:e.target.value});
    };

    return(
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                        <Bug className="w-8 h-8 text-red-600"/>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
                    <p className="text-gray-600 mt-2">Join LadyBug today</p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                        <AlertCircle className='w-5 h-5 text-red-600 flex-shrink-0 mt-0.5'/>
                        <p className="text-sm text-red-800">{error}</p>
                        </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition" placeholder="John Doe"/>
                    
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition" placeholder="you@example.com"/>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2-translate-y-1/2 w-5 h-5 text-gray-400"/>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition" placeholder="********"/>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition" placeholder="********"/>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 focus:ring-4 focus:ring-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition">{loading ? 'Creating account...' : 'Create Account'}</button>
                </form>

                <p className="text-center text-gray-600 mt-6">
                    Already have an account? {''}
                    <Link to="/login" className="text-red-600 font-semibold hover:text-red-700">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;