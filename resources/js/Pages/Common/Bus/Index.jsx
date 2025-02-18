import MainBody from '@/Components/MainBody.jsx';
import PrimaryButton from '@/Components/PrimaryButton.jsx';
import AddScheduleModal from '@/Components/schedules/AddScheduleModal.jsx';
import SearchComponent from '@/Components/SearchComponent.jsx';
import Table from '@/Components/Table.jsx';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import AddBusModal from "@/Components/buses/AddBusModal.jsx";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline/index.js";

export default function Index({ buses, columns }) {
    const { user } = usePage().props.auth;
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedBus, setSelectedBus] = useState(null);

    const fcolumns = [
        ...columns,
        {
            key: 'actions',
            title: 'Actions',
            render: (item) => (
                <div className="flex space-x-2">
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
                    <SearchComponent routeName="buses.index" />
                    {user.user_type === 'admin' && (
                        <PrimaryButton
                            className="ms-2"
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            Add Bus
                        </PrimaryButton>
                    )}
                </div>
                <div className="p-1">
                    <Table columns={fcolumns} data={buses} />
                </div>
                {isAddModalOpen && (
                    <AddBusModal
                        isOpen={isAddModalOpen}
                        onClose={() => setIsAddModalOpen(false)}
                        routeData={selectedBus}
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
