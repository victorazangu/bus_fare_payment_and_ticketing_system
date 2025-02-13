import MainBody from '@/Components/MainBody.jsx';
import PrimaryButton from '@/Components/PrimaryButton.jsx';
import SearchComponent from '@/Components/SearchComponent.jsx';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';

export default function Index() {
    return (
        <AuthenticatedLayout>
            <MainBody>
                <div className="flex justify-between pb-3">
                    <SearchComponent routeName="routes.index" />
                    <PrimaryButton className="ms-2" onClick={() => {}}>
                        Add Booking
                    </PrimaryButton>
                </div>
                <h1 className="text-white">Admin Bookings</h1>
            </MainBody>
        </AuthenticatedLayout>
    );
}
