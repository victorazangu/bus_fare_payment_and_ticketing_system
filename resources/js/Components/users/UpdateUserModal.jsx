import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import ModalBody from '@/Components/ModalBody.jsx';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton.jsx';
import SelectInput from '@/Components/SelectInput.jsx';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function UpdateUserModal({
    isOpen,
    onClose,
    userData,
    selectedUserId,
    onSave,
}) {
    console.log('selectedUser ', userData);
    const { data, setData, patch, processing, errors, reset } = useForm({
        name: userData?.name,
        email: userData?.email,
        user_type: userData?.user_type,
        phone: userData?.phone,
        address: userData?.address,
    });

    useEffect(() => {
        if (userData) {
            setData({
                name: userData.name || '',
                email: userData.email || '',
                user_type: userData.user_type || '',
                phone: userData.phone || '',
                address: userData.address || '',
            });
        }
    }, [userData]);

    const submit = (e) => {
        e.preventDefault();

        patch(route('admin.users.update', selectedUserId), {
            onSuccess: () => {
                onSave(data);
                onClose();
            },
        });
    };

    const usersStatuses = [
        { value: 'admin', label: 'Admin' },
        { value: 'driver', label: 'Driver' },
        { value: 'passenger', label: 'Passenger' },
    ];
    if (!isOpen) return null;

    return (
        <ModalBody>
            <form onSubmit={submit}>
                <div className="mt-4">
                    <InputLabel htmlFor="name" value="Name" />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        placeholder="Enter User name"
                        className="mt-1 block w-full"
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>
                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        name="email"
                        value={data.email}
                        placeholder="Enter user email address"
                        className="mt-1 block w-full"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>
                <div className="mt-4">
                    <InputLabel htmlFor="phone" value="Phone" />
                    <TextInput
                        id="phone"
                        name="phone"
                        value={data.phone}
                        placeholder="Enter user phone number"
                        className="mt-1 block w-full"
                        onChange={(e) => setData('phone', e.target.value)}
                        required
                    />
                    <InputError message={errors.phone} className="mt-2" />
                </div>
                <div className="mt-4">
                    <InputLabel htmlFor="address" value="Address" />
                    <TextInput
                        id="address"
                        name="address"
                        value={data.address}
                        placeholder="Enter user address"
                        className="mt-1 block w-full"
                        onChange={(e) => setData('address', e.target.value)}
                        required
                    />
                    <InputError message={errors.address} className="mt-2" />
                </div>
                <div className="mt-4">
                    <InputLabel htmlFor="user_type" value="User Type" />
                    <SelectInput
                        id="user_type"
                        name="user_type"
                        value={data.user_type}
                        options={usersStatuses}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('user_type', e.target.value)}
                        required
                    />
                    <InputError message={errors.user_type} className="mt-2" />
                </div>

                <div className="mt-4 flex items-center justify-end space-x-3">
                    <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
                    <PrimaryButton
                        type="submit"
                        className="ms-4"
                        disabled={processing}
                    >
                        Update User
                    </PrimaryButton>
                </div>
            </form>
        </ModalBody>
    );
}
