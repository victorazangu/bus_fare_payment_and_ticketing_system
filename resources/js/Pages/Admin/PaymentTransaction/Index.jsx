import MainBody from '@/Components/MainBody.jsx';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';

export default function Index() {
    return (
        <AuthenticatedLayout>
            <MainBody>
                <h1 className="text-white">Admin Payment Transactions</h1>
            </MainBody>
        </AuthenticatedLayout>
    );
}
