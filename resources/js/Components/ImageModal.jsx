import { XMarkIcon } from '@heroicons/react/24/outline';

function ImageModalBody({ children, onClose, showCloseIcon = true }) {
    const handleOutsideClick = (e) => {
        if (e.target.classList.contains('fixed')) {
            onClose(); // Close the modal when clicked outside
        }
    };

    return (
        <div
            className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-gray-500 bg-opacity-75"
            onClick={handleOutsideClick}
        >
            <div className="relative w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-xl dark:bg-gray-800">
                {showCloseIcon && (
                    <button
                        onClick={onClose}
                        className="absolute right-2 top-2 m-2 p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        aria-label="Close"
                    >
                        <XMarkIcon className="m-2 h-6 w-6 p-3" />
                    </button>
                )}
                <div className="">{children}</div>
            </div>
        </div>
    );
}

export default ImageModalBody;
