import { useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function DeleteConfirmation({
    isOpen,
    onClose,
    modelId,
    modelName,
    modelTitle = 'this item', // Default text if no modelTitle is provided
    onConfirm,
}) {
    const [confirming, setConfirming] = useState(false);
    const { delete: destroy, processing } = useForm();

    const submit = (e) => {
        e.preventDefault();
        if (!confirming) return;
        destroy(route(`${modelName}.destroy`, modelId), {
            onSuccess: () => {
                onConfirm();
                onClose();
            },
        });
    };

    if (!isOpen) return null;

    return (
        <form onSubmit={submit}>
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex min-h-screen items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

                    <div className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
                        <div className="flex items-start">
                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                                <svg
                                    className="h-6 w-6 text-red-600 dark:text-red-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                            </div>

                            <div className="ml-4 text-left">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    Delete {modelTitle}
                                </h3>
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    Are you sure you want to delete {modelTitle}
                                    ? This action cannot be undone.
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center">
                            <input
                                type="checkbox"
                                id="confirm"
                                checked={confirming}
                                onChange={() => setConfirming(!confirming)}
                                className="mr-2"
                            />
                            <label
                                htmlFor="confirm"
                                className="text-sm text-gray-600 dark:text-gray-400"
                            >
                                I confirm the deletion of {modelTitle}
                            </label>
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none"
                                disabled={processing || !confirming}
                            >
                                {processing ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
