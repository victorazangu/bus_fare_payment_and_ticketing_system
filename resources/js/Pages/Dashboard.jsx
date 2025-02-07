import MainBody from '@/Components/MainBody.jsx';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Dashboard() {
    return (
        <AuthenticatedLayout>
            <MainBody>
                <h1 className="text-white">Dashboard</h1>
            </MainBody>
        </AuthenticatedLayout>
    );
}
