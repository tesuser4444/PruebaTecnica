import AuthForm from "../components/AuthForm";

export default function RegisterPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded shadow-md w-96">
                <h1 className="text-2xl font-bold mb-4 text-gray-900">Register</h1>
                <AuthForm isLogin={false} />
            </div>
        </div>
    );
}