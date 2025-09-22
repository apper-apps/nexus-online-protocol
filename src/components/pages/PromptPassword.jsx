import { useEffect } from 'react';

const PromptPassword = () => {
    useEffect(() => {
        const { ApperUI } = window.ApperSDK;
        ApperUI.showPromptPassword('#authentication-prompt-password');
    }, []);

    return (
        <>
            <div className="flex-1 py-12 px-5 flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
                <div id="authentication-prompt-password" className="bg-white/80 backdrop-blur-sm mx-auto w-[400px] max-w-full p-10 rounded-2xl shadow-xl border border-white/20"></div>
            </div>
        </>
    );
};

export default PromptPassword;