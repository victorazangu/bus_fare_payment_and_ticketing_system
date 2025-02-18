import MainBody from '@/Components/MainBody.jsx';
import PrimaryButton from '@/Components/PrimaryButton.jsx';
import SearchComponent from '@/Components/SearchComponent.jsx';
import Table from '@/Components/Table.jsx';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';

export default function Index({ cancellations, columns }) {
    return (
        <AuthenticatedLayout>
            <MainBody>
                <div className="flex justify-between pb-3">
                    <SearchComponent routeName="cancellations.index" />
                    {/*<PrimaryButton className="ms-2" onClick={() => {}}>*/}
                    {/*    Log Cancellation*/}
                    {/*</PrimaryButton>*/}
                </div>
                <div className="p-1">
                    <Table columns={columns} data={cancellations} />
                </div>
            </MainBody>
        </AuthenticatedLayout>
    );
}
