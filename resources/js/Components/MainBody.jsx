const MainBody = ({ children }) => {
    return (
        <div className="p-2">
            <div className="mx-auto sm:px-6 lg:px-8">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainBody;
