import MainBody from '@/Components/MainBody.jsx';
import TopBarStat from '@/Components/TopBarStat.jsx';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';

export default function Dashboard({ totals }) {
    return (
        <AuthenticatedLayout>
            <MainBody>
                ﬁ
                <TopBarStat stats={totals.stats} />
                <h1 className="mb-4 text-2xl font-bold text-white">
                    Passenger Dashboard
                </h1>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="flex h-60 items-center justify-center rounded-lg bg-gray-800 p-4">
                        <p className="text-gray-400">
                            [ Line Chart Placeholder ]
                        </p>
                    </div>
                    <div className="flex h-60 items-center justify-center rounded-lg bg-gray-800 p-4">
                        <p className="text-gray-400">
                            [ Bar Chart Placeholder ]
                        </p>
                    </div>
                    <div className="flex h-60 items-center justify-center rounded-lg bg-gray-800 p-4">
                        <p className="text-gray-400">
                            [ Pie Chart Placeholder ]
                        </p>
                    </div>
                </div>
                <div className="mt-6 rounded-lg bg-gray-800 p-4">
                    <h2 className="mb-2 text-lg font-semibold text-gray-200">
                        Recent Trips
                    </h2>
                    <div className="flex h-32 items-center justify-center rounded-lg border border-gray-600">
                        <p className="text-gray-400">
                            [ Recent Trips Data Placeholder ]
                        </p>
                    </div>
                </div>
                <div className="mt-6 rounded-lg bg-gray-800 p-4">
                    <h2 className="mb-2 text-lg font-semibold text-gray-200">
                        Notifications
                    </h2>
                    <div className="flex h-32 items-center justify-center rounded-lg border border-gray-600">
                        <p className="text-gray-400">
                            [ Notifications Placeholder ]
                        </p>
                    </div>
                </div>
            </MainBody>
        </AuthenticatedLayout>
    );
}
