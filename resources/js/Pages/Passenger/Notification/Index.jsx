import MainBody from '@/Components/MainBody.jsx';
import SearchComponent from '@/Components/SearchComponent.jsx';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';

export default function Index() {
    return (
        <AuthenticatedLayout>
            <MainBody>
                <div className="flex justify-between pb-3">
                    <SearchComponent routeName="routes.index" />
                </div>
                <h1 className="text-white">Passenger Notifications</h1>
            </MainBody>
        </AuthenticatedLayout>
    );
}
