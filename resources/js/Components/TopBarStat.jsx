const TopBarStat = ({ stats }) => {
    return (
        <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map(({ label, value, color }, index) =>
                value !== undefined ? (
                    <div
                        key={index}
                        className={`rounded-lg border-l-4 p-4 dark:border-opacity-75 dark:bg-opacity-20 ${color}`}
                    >
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {label}
                        </p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                            {value}
                        </p>
                    </div>
                ) : null,
            )}
        </div>
    );
};

export default TopBarStat;
