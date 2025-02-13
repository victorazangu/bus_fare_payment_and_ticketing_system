import MainBody from '@/Components/MainBody.jsx';
import SearchComponent from '@/Components/SearchComponent.jsx';
import Table from '@/Components/Table.jsx';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';

export default function Index({ notifications }) {
    return (
        <AuthenticatedLayout>
            <MainBody>
                <div className="flex justify-between pb-3">
                    <SearchComponent routeName="notifications.index" />
                </div>
                <div className="p-1">
                    <Table
                        columns={notifications.columns}
                        data={notifications.notifications}
                    />
                </div>
            </MainBody>
        </AuthenticatedLayout>
    );
}
