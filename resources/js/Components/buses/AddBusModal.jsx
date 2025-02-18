import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import ModalBody from '@/Components/ModalBody.jsx';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton.jsx';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function AddBusModal({ isOpen, onClose, busData, onSave }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        registration_number: '',
        capacity: '',
        model: '',
        year: '',
    });
    useEffect(() => {
        if (busData) {
            setData({
                registration_number: busData.registration_number || '',
                capacity: busData.capacity || '',
                model: busData.model || '',
                year: busData.year || '',
            });
        }
    }, [busData]);

    const submit = (e) => {
        e.preventDefault();

        post(route('buses.store'), {
            onSuccess: () => {
                onSave(data);
                onClose();
            },
        });
    };

    if (!isOpen) return null;

    return (
        <ModalBody>
            <form onSubmit={submit}>
                <div>
                    <InputLabel
                        htmlFor="registration_number"
                        value="Registration number"
                    />
                    <TextInput
                        id="registration_number"
                        name="registration_number"
                        value={data.registration_number}
                        className="mt-1 block w-full"
                        onChange={(e) =>
                            setData('registration_number', e.target.value)
                        }
                        required
                    />
                    <InputError
                        message={errors.registration_number}
                        className="mt-2"
                    />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="capacity" value="Capacity" />
                    <TextInput
                        id="capacity"
                        name="capacity"
                        value={data.capacity}
                        type="number"
                        className="mt-1 block w-full"
                        onChange={(e) => setData('capacity', e.target.value)}
                        required
                    />
                    <InputError message={errors.capacity} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="model" value="Model" />
                    <TextInput
                        id="model"
                        name="model"
                        value={data.model}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('model', e.target.value)}
                        required
                    />
                    <InputError message={errors.model} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="year" value="year" />
                    <TextInput
                        id="year"
                        name="year"
                        value={data.year}
                        type="number"
                        className="mt-1 block w-full"
                        onChange={(e) => setData('year', e.target.value)}
                        required
                    />
                    <InputError message={errors.year} className="mt-2" />
                </div>

                <div className="mt-4 flex items-center justify-end space-x-3">
                    <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
                    <PrimaryButton
                        type="submit"
                        className=""
                        disabled={processing}
                    >
                        <span className="p-1"> Add Bus</span>
                    </PrimaryButton>
                </div>
            </form>
        </ModalBody>
    );
}
