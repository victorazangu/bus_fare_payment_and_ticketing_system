import MainBody from '@/Components/MainBody.jsx';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';

export default function Dashboard() {
    return (
        <AuthenticatedLayout>
            <MainBody>
                <h1 className="text-white">Admin Dashboard</h1>
            </MainBody>
        </AuthenticatedLayout>
    );
}
