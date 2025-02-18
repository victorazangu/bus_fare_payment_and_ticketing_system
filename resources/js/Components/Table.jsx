import Pagination from '@/Components/Pagination.jsx';

const Table = ({ columns = [], data = [] }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={column.key || index}
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                            >
                                {column.title}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                    {data?.data?.length > 0 ? (
                        data.data.map((item, idx) => (
                            <tr key={idx}>
                                {columns.map((column, index) => (
                                    <td
                                        key={`${item.id}-${column.key || index}`}
                                        className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-300"
                                    >
                                        {column.render
                                            ? column.render(item)
                                            : item[column.key] || 'N/A'}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-6 py-4 text-center text-gray-500"
                            >
                                No data available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {data && data.links && <Pagination links={data.links} />}
        </div>
    );
};

export default Table;
