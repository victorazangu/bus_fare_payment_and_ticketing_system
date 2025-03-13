import AddBookingModal from '@/Components/bookings/AddBookingModal.jsx';
import EditBookingModal from '@/Components/bookings/EditBookingModal.jsx';
import CancelConfirmation from '@/Components/CancelConfirmation.jsx';
import DeleteConfirmation from '@/Components/DeleteConfirmation.jsx';
import MainBody from '@/Components/MainBody.jsx';
import PaymentModal from '@/Components/PaymentModal.jsx';
import SearchComponent from '@/Components/SearchComponent.jsx';
import SecondaryButton from '@/Components/SecondaryButton.jsx';
import Table from '@/Components/Table.jsx';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import {
    ArrowDownTrayIcon,
    CreditCardIcon,
    PencilIcon,
    QrCodeIcon,
    TrashIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline/index.js';
import { jsPDF } from 'jspdf';

import ImageModalBody from '@/Components/ImageModal.jsx';
import { useState } from 'react';

export default function Index({ bookings, schedules, bookingsOptions }) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [isCancelOpen, setIsCancelOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [qrCodeImageUrl, setQrCodeImageUrl] = useState(null);

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

    function handlePayment(id) {
        setSelectedBookingId(id);
        setIsPaymentOpen(true);
    }

    function handleCancel(id) {
        setSelectedBookingId(id);
        setIsCancelOpen(true);
    }

    function handleShowQr(id) {
        const selectedBooking = bookings.bookings.data.find(
            (booking) => booking.id === id,
        );
        setQrCodeImageUrl(selectedBooking.qr_code_url);
        setIsViewModalOpen(true);
    }

    function handleDownLoad(id) {
        const selectedBooking = bookings.bookings.data.find(
            (booking) => booking.id === id,
        );
        if (!selectedBooking) {
            console.error('Booking not found!');
            return;
        }
        const doc = new jsPDF('landscape', 'mm', [85, 240]);
        const primaryColor = [0, 0, 0];
        const secondaryColor = [0, 102, 204];
        const goldColor = [212, 175, 55];
        doc.setFillColor(goldColor[0], goldColor[1], goldColor[2]);
        doc.rect(0, 0, 240, 10, 'F');
        doc.setFillColor(
            secondaryColor[0],
            secondaryColor[1],
            secondaryColor[2],
        );
        doc.triangle(0, 75, 0, 85, 70, 85, 'F');
        doc.setFillColor(goldColor[0], goldColor[1], goldColor[2]);
        doc.triangle(0, 85, 70, 85, 25, 75, 'F');
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text('Bus Fare Payment And Ticketing System', 15, 20);
        doc.setFillColor(goldColor[0], goldColor[1], goldColor[2]);
        doc.rect(215, 15, 15, 5, 'F');
        doc.setDrawColor(200, 200, 200);
        doc.setLineDashPattern([1, 1], 0);
        doc.line(130, 10, 130, 75);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('BOARDING PASS', 15, 30);
        doc.text('FIRST CLASS', 145, 30);
        doc.setFontSize(8);
        doc.setTextColor(
            secondaryColor[0],
            secondaryColor[1],
            secondaryColor[2],
        );
        doc.text('Name', 15, 35);
        doc.text('Fare base', 60, 35);
        doc.text('From', 15, 45);
        doc.text('To', 15, 55);
        doc.text('Seat', 15, 65);
        doc.text('Date', 60, 45);
        doc.text('Name', 145, 35);
        doc.text('From', 145, 45);
        doc.text('To', 180, 45);
        doc.text('Date', 145, 55);
        doc.text('Ticket number', 145, 65);
        doc.setFontSize(10);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text(`${selectedBooking.user_name}`, 15, 40);
        doc.text('ADULT', 60, 40);
        doc.text(`${selectedBooking.origin}`, 15, 50);
        doc.text(`${selectedBooking.destination}`, 15, 60);
        doc.setFontSize(20);
        doc.text(`${selectedBooking.seat_numbers}`, 15, 70);
        doc.setFontSize(10);
        doc.text(`${selectedBooking.booking_date}`, 60, 50);
        doc.text(`BK-NO-${selectedBooking.booking_code}`, 60, 70);
        doc.setFontSize(10);
        doc.text(`${selectedBooking.user_name}    MR`, 145, 40);
        doc.text(`${selectedBooking.origin}`, 145, 50);
        doc.text(`${selectedBooking.destination}`, 180, 50);
        doc.text(`${selectedBooking.booking_date}`, 145, 60);
        doc.text(`BK-NO-${selectedBooking.booking_code}`, 145, 70);
        doc.setFontSize(20);
        const qrCodeUrl = selectedBooking.qr_code_url;
        if (qrCodeUrl) {
            doc.addImage(qrCodeUrl, 'PNG', 90, 35, 30, 30);
            doc.addImage(qrCodeUrl, 'PNG', 200, 35, 30, 30);
        }
        doc.setFontSize(6);
        doc.text('CHECK-IN COUNTER CLOSES 15 MINUTES BEFORE DEPARTURE', 80, 80);
        doc.save(`ticket_${selectedBooking.booking_code}.pdf`);
    }

    console.log('qrCodeImageUrl ', qrCodeImageUrl);

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
                    </button>

                    <button
                        onClick={() => handlePayment(item.id)}
                        className="p-1 text-yellow-600 hover:text-yellow-800"
                    >
                        <CreditCardIcon className="h-5 w-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" />
                    </button>
                    <button
                        onClick={() => handleCancel(item.id)}
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
                    <button
                        onClick={() => handleDownLoad(item.id)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                    >
                        <ArrowDownTrayIcon className="h-5 w-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" />
                    </button>
                    <button
                        onClick={() => handleShowQr(item.id)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                    >
                        <QrCodeIcon className="h-5 w-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" />
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

                {isPaymentOpen && (
                    <PaymentModal
                        isOpen={isPaymentOpen}
                        onClose={() => setIsPaymentOpen(false)}
                        modelId={selectedBookingId}
                        modelName="payments"
                        modelTitle="Payment"
                        bookings={bookingsOptions}
                        onConfirm={() => {
                            console.log('Payment processed successfully');
                        }}
                    />
                )}

                {isCancelOpen && (
                    <CancelConfirmation
                        isOpen={isCancelOpen}
                        onClose={() => setIsCancelOpen(false)}
                        modelId={selectedBookingId}
                        modelName="cancellations"
                        modelTitle="Booking"
                        onConfirm={() => {
                            console.log('Booking is canceled successfully');
                        }}
                    />
                )}

                {isViewModalOpen && qrCodeImageUrl && (
                    <ImageModalBody
                        showCloseIcon={true}
                        onClose={() => setIsViewModalOpen(false)}
                    >
                        <div className="flex justify-center p-10">
                            <img src={qrCodeImageUrl} alt="Booking QR Code" />
                        </div>
                    </ImageModalBody>
                )}
            </MainBody>
        </AuthenticatedLayout>
    );
}
