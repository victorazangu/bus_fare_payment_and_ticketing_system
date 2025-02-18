import UserCard from '@/Components/cards/UserCard.jsx';
import DeleteConfirmation from '@/Components/DeleteConfirmation.jsx';
import MainBody from '@/Components/MainBody.jsx';
import Pagination from '@/Components/Pagination.jsx';
import PrimaryButton from '@/Components/PrimaryButton.jsx';
import SearchComponent from '@/Components/SearchComponent.jsx';
import AddUserModal from '@/Components/users/AddUserModal.jsx';
import UpdateUserModal from '@/Components/users/UpdateUserModal.jsx';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { useState } from 'react';

export default function Index({ passengers }) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    function handleDelete(id) {
        setSelectedUserId(id);
        setIsDeleteOpen(true);
    }

    // Handle update modal
    function handleUpdate(id) {
        console.log('Edit clicked for user with ID:', id);
        setSelectedUserId(id);
        fetchUserData(id);
        setIsEditModalOpen(true);
    }

    const handleCardClick = (emp_id) => {
        console.log('Clicked Employee ID:', emp_id);
    };

    return (
        <AuthenticatedLayout>
            <MainBody>
                <div className="flex flex-col justify-between space-y-3 pb-3 md:flex-row md:space-y-0">
                    <SearchComponent routeName="admin.users.index" />
                    <PrimaryButton
                        className="ms-2"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        Add User
                    </PrimaryButton>
                </div>
                <h1 className="mb-4 text-2xl font-bold text-white">Users</h1>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {passengers.data.map((member, index) => (
                        <UserCard
                            key={index}
                            member={member}
                            handleCardClick={handleCardClick}
                            handleUpdate={() => handleUpdate(member.id)} // Handle Update Click
                            handleDelete={() => handleDelete(member.id)} // Handle Delete Click
                        />
                    ))}
                    {isDeleteOpen && (
                        <DeleteConfirmation
                            isOpen={isDeleteOpen}
                            onClose={() => setIsDeleteOpen(false)}
                            modelId={selectedUserId}
                            modelName="admin.users"
                            modelTitle="Users"
                            onConfirm={() => {
                                console.log('User deleted successfully');
                            }}
                        />
                    )}

                    {isEditModalOpen &&
                        selectedUser && ( // Ensure selectedUser is available
                            <UpdateUserModal
                                isOpen={isEditModalOpen}
                                onClose={() => setIsEditModalOpen(false)}
                                routeData={selectedUser}
                                selectedUserId={selectedUserId}
                                onSave={(updatedData) => {
                                    console.log(updatedData);
                                    setIsEditModalOpen(false);
                                }}
                            />
                        )}
                </div>
                <div>
                    {passengers && passengers.links && (
                        <Pagination links={passengers.links} />
                    )}
                </div>
                {isAddModalOpen && (
                    <AddUserModal
                        isOpen={isAddModalOpen}
                        onClose={() => setIsAddModalOpen(false)}
                        routeData={selectedUser}
                        onSave={(addData) => {
                            console.log(addData);
                            setIsAddModalOpen(false);
                        }}
                    />
                )}
            </MainBody>
        </AuthenticatedLayout>
    );
}
