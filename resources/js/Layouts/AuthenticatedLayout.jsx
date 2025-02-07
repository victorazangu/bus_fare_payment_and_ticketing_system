import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import NotificationModal from '@/Components/NotificationModal.jsx';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { BellIcon } from '@heroicons/react/24/outline';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const isAdmin = user?.user_type === 'admin';
    const isPassenger = user?.user_type === 'passenger';
    const isDriver = user?.user_type === 'driver';
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            message: 'New booking received for Route A',
            sent_at: '2024-10-27 10:00',
        },
        {
            id: 2,
            message: 'Bus 123 is delayed by 30 minutes',
            sent_at: '2024-10-27 09:30',
        },
        {
            id: 3,
            message: 'Promotion code SUMMER20 is expiring soon',
            sent_at: '2024-10-26 18:00',
        },
        {
            id: 4,
            message: 'A user cancelled booking #456',
            sent_at: '2024-10-26 12:00',
        },
        // {
        //     id: 5,
        //     message: 'Maintenance scheduled for Bus 789',
        //     sent_at: '2024-10-25 20:00',
        // },
    ]);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <nav className="border-b border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            {/* Admin Navigation */}
                            {isAdmin && (
                                <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                    <NavLink
                                        href={route('dashboard')}
                                        active={route().current('dashboard')}
                                    >
                                        Dashboard
                                    </NavLink>
                                    <NavLink
                                        href={route('routes.index')}
                                        active={route().current('routes.*')}
                                    >
                                        Routes
                                    </NavLink>
                                    <NavLink
                                        href={route('schedules.index')}
                                        active={route().current('schedules.*')}
                                    >
                                        Schedules
                                    </NavLink>
                                    <NavLink
                                        href={route('buses.index')}
                                        active={route().current('buses.*')}
                                    >
                                        Buses
                                    </NavLink>
                                    <NavLink
                                        href={route('users.index')}
                                        active={route().current('users.*')}
                                    >
                                        Users
                                    </NavLink>
                                    <NavLink
                                        href={route('bookings.index')}
                                        active={route().current('bookings.*')}
                                    >
                                        Bookings
                                    </NavLink>
                                    <NavLink
                                        href={route('payments.index')}
                                        active={route().current('payments.*')}
                                    >
                                        Payments
                                    </NavLink>
                                    <NavLink
                                        href={route('cancellations.index')}
                                        active={route().current(
                                            'cancellations.*',
                                        )}
                                    >
                                        Cancellations
                                    </NavLink>
                                </div>
                            )}

                            {/* Passenger Navigation */}
                            {isPassenger && (
                                <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                    <NavLink
                                        href={route('home')}
                                        active={route().current('home')}
                                    >
                                        Home
                                    </NavLink>
                                    <NavLink
                                        href={route('bookings.index')}
                                        active={route().current(
                                            'bookings.index',
                                        )}
                                    >
                                        My Bookings
                                    </NavLink>
                                    <NavLink
                                        href={route('profile.edit')}
                                        active={route().current('profile.edit')}
                                    >
                                        Profile
                                    </NavLink>
                                </div>
                            )}

                            {/* Driver Navigation */}
                            {isDriver && (
                                <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                    <NavLink
                                        href={route('driver.dashboard')}
                                        active={route().current(
                                            'driver.dashboard',
                                        )}
                                    >
                                        Dashboard
                                    </NavLink>
                                    <NavLink
                                        href={route('driver.schedule')}
                                        active={route().current(
                                            'driver.schedule',
                                        )}
                                    >
                                        My Schedule
                                    </NavLink>
                                </div>
                            )}
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            {/*to add notification here*/}
                            <button onClick={toggleModal} className="relative">
                                <BellIcon className="h-9 w-9 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" />
                                {notifications.length > 0 && (
                                    <span className="absolute right-0 top-1 inline-flex items-center justify-center rounded-full bg-red-600 px-2 py-1 text-xs font-bold leading-none text-red-100">
                                        {notifications.length}
                                    </span>
                                )}
                            </button>
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none dark:text-gray-500 dark:hover:bg-gray-900 dark:hover:text-gray-400 dark:focus:bg-gray-900 dark:focus:text-gray-400"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            Dashboard
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            Dashboard 2
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4 dark:border-gray-600">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>
            <main>{children}</main>
            {isModalOpen && (
                <NotificationModal
                    notifications={notifications}
                    onClose={toggleModal}
                />
            )}
        </div>
    );
}
