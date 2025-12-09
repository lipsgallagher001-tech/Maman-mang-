import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp, checkAdminExists } from '../services/supabase';
import { PageView } from '../types';
import { Lock, Mail, User, AlertCircle } from 'lucide-react';

interface SignupProps {
    onNavigate: (page: PageView) => void;
    onSignupSuccess: () => void;
}

const Signup: React.FC<SignupProps> = ({ onNavigate, onSignupSuccess }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [checkingAdmin, setCheckingAdmin] = useState(true);
    const [adminExists, setAdminExists] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkExistingAdmin = async () => {
            setCheckingAdmin(true);
            try {
                const exists = await checkAdminExists();
                setAdminExists(exists);
            } catch (err) {
                console.error('Error checking admin:', err);
                // En cas d'erreur, on permet l'inscription pour ne pas bloquer le premier admin
                setAdminExists(false);
            } finally {
                setCheckingAdmin(false);
            }
        };

        checkExistingAdmin();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Double vérification avant la création
        if (adminExists) {
            setError("Un compte administrateur existe déjà. Contactez l'administrateur actuel.");
            return;
        }

        setLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("Le mot de passe doit contenir au moins 6 caractères.");
            setLoading(false);
            return;
        }

        try {
            await signUp(email, password);
            alert("Compte créé ! Veuillez vérifier vos emails pour confirmer votre inscription, ou connectez-vous si la confirmation n'est pas requise.");
            onSignupSuccess();
            navigate('/login');
        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue lors de l\'inscription.');
        } finally {
            setLoading(false);
        }
    };

    if (checkingAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-brand-cream">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange mb-4"></div>
                    <p className="text-brand-brown">Vérification...</p>
                </div>
            </div>
        );
    }

    if (adminExists) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-brand-cream px-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                    <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <AlertCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-brand-brown mb-2">Inscription fermée</h2>
                        <p className="text-gray-600">
                            Un compte administrateur existe déjà pour ce site.
                        </p>
                    </div>

                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-orange-800">
                            <strong>Note :</strong> Pour des raisons de sécurité, un seul compte administrateur peut être créé.
                            Si vous êtes le propriétaire du site et avez perdu vos identifiants, contactez le support technique.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full bg-brand-orange text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg"
                        >
                            Se connecter
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                        >
                            Retour au site
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-cream px-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-brand-brown mb-2">Créer un compte</h2>
                    <p className="text-gray-500">Premier compte administrateur</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
                                placeholder="admin@maman-mange.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le mot de passe</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-orange text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-200"
                    >
                        {loading ? 'Création...' : 'S\'inscrire'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        Déjà un compte ?{' '}
                        <button
                            onClick={() => navigate('/login')}
                            className="text-brand-orange font-bold hover:underline"
                        >
                            Se connecter
                        </button>
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="mt-4 text-sm text-gray-400 hover:text-gray-600"
                    >
                        Retour au site
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Signup;
