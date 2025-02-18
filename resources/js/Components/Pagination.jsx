import { Link } from '@inertiajs/react';

const Pagination = ({ links }) => {
    if (!links?.length) return null;

    return (
        <nav aria-label="Pagination" className="mt-4">
            <ul className="flex h-10 items-center -space-x-px text-base">
                {links.map((link, index) => {
                    if (index === 0) {
                        return (
                            <li key={index}>
                                {link.url ? (
                                    <Link
                                        href={link.url}
                                        className="ms-0 flex h-10 items-center justify-center rounded-s-lg border border-e-0 px-4 leading-tight text-gray-500 hover:text-gray-700"
                                        preserveScroll
                                    >
                                        <span className="sr-only">
                                            Previous
                                        </span>
                                        <svg
                                            className="h-3 w-3 rtl:rotate-180"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 6 10"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M5 1 1 5l4 4"
                                            />
                                        </svg>
                                    </Link>
                                ) : (
                                    <span className="ms-0 flex h-10 cursor-default items-center justify-center rounded-s-lg border border-e-0 px-4 leading-tight text-gray-400">
                                        <span className="sr-only">
                                            Previous
                                        </span>
                                        <svg
                                            className="h-3 w-3 rtl:rotate-180"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 6 10"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M5 1 1 5l4 4"
                                            />
                                        </svg>
                                    </span>
                                )}
                            </li>
                        );
                    }
                    if (index === links.length - 1) {
                        return (
                            <li key={index}>
                                {link.url ? (
                                    <Link
                                        href={link.url}
                                        className="flex h-10 items-center justify-center rounded-e-lg border px-4 leading-tight text-gray-500 hover:text-gray-700"
                                        preserveScroll
                                    >
                                        <span className="sr-only">Next</span>
                                        <svg
                                            className="h-3 w-3 rtl:rotate-180"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 6 10"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="m1 9 4-4-4-4"
                                            />
                                        </svg>
                                    </Link>
                                ) : (
                                    <span className="flex h-10 cursor-default items-center justify-center rounded-e-lg border px-4 leading-tight text-gray-400">
                                        <span className="sr-only">Next</span>
                                        <svg
                                            className="h-3 w-3 rtl:rotate-180"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 6 10"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="m1 9 4-4-4-4"
                                            />
                                        </svg>
                                    </span>
                                )}
                            </li>
                        );
                    }
                    return (
                        <li key={index}>
                            {link.url ? (
                                <Link
                                    href={link.url}
                                    className={`flex h-10 items-center justify-center border px-4 leading-tight ${
                                        link.active
                                            ? 'z-10 border-blue-300 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700'
                                            : 'bg-transparent text-gray-500 hover:bg-transparent hover:text-gray-700'
                                    }`}
                                    preserveScroll
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ) : (
                                <span
                                    className="flex h-10 cursor-default items-center justify-center border px-4 leading-tight text-gray-500"
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            )}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default Pagination;
