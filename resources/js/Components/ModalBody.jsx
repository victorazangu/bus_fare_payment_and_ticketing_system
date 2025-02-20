import { XMarkIcon } from '@heroicons/react/24/outline';

function ModalBody({ children, onClose, showCloseIcon = true }) {
    return (
        <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-gray-500 bg-opacity-75">
            <div className="relative w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-xl dark:bg-gray-800">
                {showCloseIcon && onClose && (
                    <button
                        onClick={onClose}
                        className="z-1000 absolute right-2 top-2 text-gray-500 hover:text-gray-300 focus:outline-none"
                        aria-label="Close"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                )}
                <div className="p-4">{children}</div>
            </div>
        </div>
    );
}

export default ModalBody;
