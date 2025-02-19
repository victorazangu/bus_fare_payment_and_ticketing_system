import AddBookingModal from '@/Components/bookings/AddBookingModal.jsx';
import EditBookingModal from '@/Components/bookings/EditBookingModal.jsx';
import DeleteConfirmation from '@/Components/DeleteConfirmation.jsx';
import MainBody from '@/Components/MainBody.jsx';
import SearchComponent from '@/Components/SearchComponent.jsx';
import SecondaryButton from '@/Components/SecondaryButton.jsx';
import Table from '@/Components/Table.jsx';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import {
    CreditCardIcon,
    PencilIcon,
    TrashIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline/index.js';
import { useState } from 'react';

export default function Index({ bookings, schedules }) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState(null);


    function handleEdit(id) {
        console.log('bookings ', bookings);
        const selectToEdit = bookings.bookings.data.find(
            (booking) => booking.id === id,
        );
        setSelectedBooking(selectToEdit);
        setIsEditModalOpen(true);
    }
    function handleDelete(id) {
        setSelectedBookingId(id);
        setIsDeleteOpen(true);
    }


    const fcolumns = [
        ...bookings.columns,
        {
            key: 'actions',
            title: 'Actions',
            render: (item) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleEdit(item.id)}
                        className="relative p-1 text-yellow-600 hover:text-yellow-800"
                    >
                        <PencilIcon className="h-5 w-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" />
                        {/*<span className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 transform rounded-md bg-gray-800 px-2 py-1 text-sm text-yellow-600 shadow-lg group-hover:block">*/}
                        {/*    Edit Booking*/}
                        {/*</span>*/}
                    </button>

                    <button
                        onClick={() => {}}
                        className="p-1 text-yellow-600 hover:text-yellow-800"
                    >
                        <CreditCardIcon className="h-5 w-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" />
                    </button>
                    <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 text-red-600 hover:text-red-800"
                    >
                        <XMarkIcon className="h-5 w-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" />
                    </button>
                    <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 text-red-600 hover:text-red-800"
                    >
                        <TrashIcon className="h-5 w-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" />
                    </button>
                </div>
            ),
        },
    ];
    return (
        <AuthenticatedLayout>
            <MainBody>
                <div className="flex justify-between pb-3">
                    <SearchComponent routeName="bookings.index" />
                    <SecondaryButton
                        className="ms-2"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        Add Booking
                    </SecondaryButton>
                </div>
                <div className="p-1">
                    <Table columns={fcolumns} data={bookings.bookings} />
                </div>
                {isAddModalOpen && (
                    <AddBookingModal
                        isOpen={isAddModalOpen}
                        onClose={() => setIsAddModalOpen(false)}
                        bookingData={selectedBooking}
                        onSave={(addData) => {
                            console.log(addData);
                            setIsAddModalOpen(false);
                        }}
                        schedules={schedules}
                    />
                )}

                {isEditModalOpen && (
                    <EditBookingModal
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        bookingData={selectedBooking}
                        onSave={(addData) => {
                            console.log(addData);
                            setIsEditModalOpen(false);
                        }}
                        schedules={schedules}
                    />
                )}

                {isDeleteOpen && (
                    <DeleteConfirmation
                        isOpen={isDeleteOpen}
                        onClose={() => setIsDeleteOpen(false)}
                        modelId={selectedBookingId}
                        modelName="bookings"
                        modelTitle="Booking"
                        onConfirm={() => {
                            console.log('Booking deleted successfully');
                        }}
                    />
                )}
            </MainBody>
        </AuthenticatedLayout>
    );
}
