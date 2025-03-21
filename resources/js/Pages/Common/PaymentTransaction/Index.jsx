import MainBody from '@/Components/MainBody.jsx';
import AddPaymentModal from '@/Components/payments/AddPaymentModal.jsx';
import SearchComponent from '@/Components/SearchComponent.jsx';
import SecondaryButton from '@/Components/SecondaryButton.jsx';
import Table from '@/Components/Table.jsx';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { useState } from 'react';

export default function Index({ transactions, columns, bookings }) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    return (
        <AuthenticatedLayout>
            <MainBody>
                <div className="flex justify-between pb-3">
                    <SearchComponent routeName="payments.index" />
                    <SecondaryButton
                        className="ms-2"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        Add Payment
                    </SecondaryButton>
                </div>
                <div className="p-1">
                    <Table columns={columns} data={transactions} />
                </div>
                {isAddModalOpen && (
                    <AddPaymentModal
                        isOpen={isAddModalOpen}
                        onClose={() => setIsAddModalOpen(false)}
                        paymentData={selectedPayment}
                        onSave={(addData) => {
                            console.log(addData);
                            setIsAddModalOpen(false);
                        }}
                        bookings={bookings}
                    />
                )}
            </MainBody>
        </AuthenticatedLayout>
    );
}
