import UserCard from '@/Components/cards/UserCard.jsx';
import MainBody from '@/Components/MainBody.jsx';
import PrimaryButton from '@/Components/PrimaryButton.jsx';
import SearchComponent from '@/Components/SearchComponent.jsx';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';

export default function Index({ passengers }) {
    const handleCardClick = (emp_id) => {
        console.log('Clicked Employee ID:', emp_id);
    };
    console.log('passengers', passengers);
    return (
        <AuthenticatedLayout>
            <MainBody>
                <div className="flex flex-col justify-between space-y-3 pb-3 md:flex-row md:space-y-0">
                    <SearchComponent routeName="admin.users.index" />
                    <PrimaryButton className="ms-2" onClick={() => {}}>
                        Add User
                    </PrimaryButton>
                </div>
                <h1 className="mb-4 text-2xl font-bold text-white">
                    Admin Users
                </h1>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {passengers.map((member, index) => (
                        <UserCard
                            key={index}
                            member={member}
                            handleCardClick={handleCardClick}
                        />
                    ))}
                </div>
            </MainBody>
        </AuthenticatedLayout>
    );
}
