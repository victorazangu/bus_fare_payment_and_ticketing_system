import MainBody from '@/Components/MainBody.jsx';
import ModalBody from '@/Components/ModalBody.jsx';
import DeleteRouteConfirmation from '@/Components/route/DeleteRouteConfirmation.jsx';
import Table from '@/Components/Table.jsx';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import {
    EyeIcon,
    PencilIcon,
    TrashIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline/index.js';
import { useState } from 'react';
import EditRouteModal from "@/Components/route/EditRouteModal.jsx";
import { usePage } from "@inertiajs/react";

export default function Index({ routes }) {
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [selectedRouteId, setSelectedRouteId] = useState(null);

    function handleView(id) {
        console.log('id for view', id);
        setIsViewModalOpen(true);
    }

    function handleEdit(id) {
        console.log('id for edit ', id);
        const routeToEdit = routes.routes.find(route => route.id === id);
        setSelectedRoute(routeToEdit);
        setIsEditModalOpen(true);
    }
    const user = usePage().props.auth.user;

    function handleDelete(id) {
        console.log('id for delete', id);
        setSelectedRouteId(id);
        setIsDeleteOpen(true);
    }

    const columns = [
        ...routes.columns,
        {
            key: 'actions',
            title: 'Actions',
            render: (item) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleView(item.id)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                    >
                        <EyeIcon className="h-5 w-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" />
                    </button>
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
                <div className="p-1">
                    <Table columns={columns} data={routes.routes} />
                </div>

                {/* View Modal */}
                {isViewModalOpen && (
                    <ModalBody showCloseIcon={true}>
                        <button
                            onClick={() => setIsViewModalOpen(false)}
                            className="p-1 text-red-600 hover:text-red-800"
                        >
                            <img src="map.png" alt="Map" />
                            <XMarkIcon className="m-3 h-5 w-5 text-end text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" />
                        </button>
                    </ModalBody>
                )}

                {/* Delete Confirmation Modal */}
                {isDeleteOpen && (
                    <DeleteRouteConfirmation
                        isOpen={isDeleteOpen}
                        onClose={() => setIsDeleteOpen(false)}
                        routeId={selectedRoute}
                        onConfirm={() => {
                            console.log('Deleting route ID:', selectedRouteId);
                            setIsDeleteOpen(false);
                        }}
                    />
                )}

                {/* Edit Route Modal */}
                {isEditModalOpen && (
                    <EditRouteModal
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        routeData={selectedRoute}
                        onSave={(updatedData) => {
                            console.log('Saving updated route:', updatedData);
                            setIsEditModalOpen(false);
                        }}
                    />
                )}
            </MainBody>
        </AuthenticatedLayout>
    );
}
