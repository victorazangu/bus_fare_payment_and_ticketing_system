import { router } from '@inertiajs/react';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';

const SearchComponent = ({
    routeName,
    queryParam = 'search',
    placeholder = 'Search...',
    onSearch = null,
    onClear = null,
    inertiaOptions = {
        preserveState: true,
        preserveScroll: true,
        replace: true,
    },
}) => {
    const params = new URLSearchParams(window.location.search);
    const [search, setSearch] = useState(params.get(queryParam) || '');

    const debouncedSearch = debounce((searchTerm) => {
        if (searchTerm.length >= 3 || searchTerm.length === 0) {
            if (onSearch) {
                onSearch(searchTerm);
                return;
            }
            router.get(
                route(routeName),
                { [queryParam]: searchTerm },
                inertiaOptions,
            );
        }
    }, 300);

    useEffect(() => {
        const handleUrlChange = () => {
            const searchParam = new URLSearchParams(window.location.search).get(
                queryParam,
            );
            if (searchParam !== search) {
                setSearch(searchParam || '');
            }
        };

        window.addEventListener('popstate', handleUrlChange);
        return () => window.removeEventListener('popstate', handleUrlChange);
    }, [queryParam, search]);

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setSearch(newValue);
        debouncedSearch(newValue);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        debouncedSearch(search);
    };

    const handleClear = () => {
        setSearch('');
        debouncedSearch('');
        if (onClear) {
            onClear();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative mb-4">
            <div className="flex items-center">
                <input
                    type="text"
                    placeholder={placeholder}
                    value={search}
                    onChange={handleInputChange}
                    className="w-full bg-transparent p-2 focus:outline-none"
                />
                {search && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-2 text-gray-500"
                    >
                        ×
                    </button>
                )}
            </div>
        </form>
    );
};

export default SearchComponent;
