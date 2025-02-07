function NotificationModal({ notifications, onClose }) {
    return (
        <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-gray-500 bg-opacity-75">
            <div className="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl dark:bg-gray-800">
                <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                    <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                        Notifications
                    </h2>
                </div>
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {notifications.map((notification) => (
                        <li key={notification.id} className="px-6 py-4">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                {notification.message}
                            </p>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                {notification.sent_at}
                            </p>
                        </li>
                    ))}
                    {notifications.length === 0 && (
                        <li className="px-6 py-4 text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                No new notifications
                            </p>
                        </li>
                    )}
                </ul>
                <div className="bg-gray-50 px-6 py-4 text-right dark:bg-gray-700">
                    <button
                        onClick={onClose}
                        className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 focus:outline-none dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NotificationModal;
