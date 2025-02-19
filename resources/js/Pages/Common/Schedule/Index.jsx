import DeleteConfirmation from '@/Components/DeleteConfirmation.jsx';
import MainBody from '@/Components/MainBody.jsx';
import AddScheduleModal from '@/Components/schedules/AddScheduleModal.jsx';
import EditScheduleModal from '@/Components/schedules/EditScheduleModal.jsx';
import SearchComponent from '@/Components/SearchComponent.jsx';
import SecondaryButton from '@/Components/SecondaryButton.jsx';
import Table from '@/Components/Table.jsx';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline/index.js';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ schedules, columns, buses, routes }) {
    const { user } = usePage().props.auth;
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [selectedScheduleId, setSelectedScheduleId] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    function handleEdit(id) {
        const scheduleToEdit = schedules.data.find(
            (schedule) => schedule.id === id,
        );
        console.log('scheduleToEdit ', scheduleToEdit);
        setSelectedSchedule(scheduleToEdit);
        setIsEditModalOpen(true);
    }

    function handleDelete(id) {
        setSelectedScheduleId(id);
        setIsDeleteOpen(true);
    }

    const fcolumns = [
        ...columns,
        {
            key: 'actions',
            title: 'Actions',
            render: (item) => (
                <div className="flex space-x-2">
                    {/*<button*/}
                    {/*    onClick={() => handleView(item.id)}*/}
                    {/*    className="p-1 text-blue-600 hover:text-blue-800"*/}
                    {/*>*/}
                    {/*    <EyeIcon className="h-5 w-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" />*/}
                    {/*</button>*/}
                    {user.user_type === 'admin' && (
                        <>
                            <button
                                onClick={() => handleEdit(item.id)}
                                className="p-1 text-yellow-600 hover:text-yellow-800"
                            >
                                <PencilIcon className="h-5 w-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" />
                            </button>
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="p-1 text-red-600 hover:text-red-800"
                            >
                                <TrashIcon className="h-5 w-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" />
                            </button>
                        </>
                    )}
                </div>
            ),
        },
    ];
    return (
        <AuthenticatedLayout>
            <MainBody>
                <div className="flex justify-between pb-3">
                    <SearchComponent routeName="schedules.index" />
                    {user.user_type === 'admin' && (
                        <SecondaryButton
                            className="ms-2"
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            Add Schedule
                        </SecondaryButton>
                    )}
                </div>
                <div className="p-1">
                    <Table columns={fcolumns} data={schedules} />
                </div>
                {isAddModalOpen && (
                    <AddScheduleModal
                        isOpen={isAddModalOpen}
                        onClose={() => setIsAddModalOpen(false)}
                        routeData={selectedSchedule}
                        buses={buses}
                        routes={routes}
                        onSave={(addData) => {
                            console.log(addData);
                            setIsAddModalOpen(false);
                        }}
                    />
                )}

                {isEditModalOpen && (
                    <EditScheduleModal
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        scheduleData={selectedSchedule}
                        buses={buses}
                        routes={routes}
                        onSave={(updatedData) => {
                            console.log(updatedData);
                            setIsEditModalOpen(false);
                        }}
                    />
                )}

                {isDeleteOpen && (
                    <DeleteConfirmation
                        isOpen={isDeleteOpen}
                        onClose={() => setIsDeleteOpen(false)}
                        modelId={selectedScheduleId}
                        modelName="schedules"
                        modelTitle="Schedule"
                        onConfirm={() => {
                            console.log('Schedule deleted successfully');
                        }}
                    />
                )}
            </MainBody>
        </AuthenticatedLayout>
    );
}
