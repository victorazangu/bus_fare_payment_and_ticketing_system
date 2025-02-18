import MainBody from '@/Components/MainBody.jsx';
import Table from '@/Components/Table.jsx';
import TopBarStat from '@/Components/TopBarStat.jsx';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';

export default function Dashboard({
    totals,
    recentTrips,
    driverNotifications,
    availableBuses,
}) {
    return (
        <AuthenticatedLayout>
            <MainBody>
                <div className="container mx-auto p-6">
                    <h1 className="mb-6 text-3xl font-semibold text-white">
                        Driver Dashboard
                    </h1>

                    <TopBarStat stats={totals.stats} />

                    <div className="rounded-lg bg-gray-800 p-4 text-white shadow-md">
                        <h2 className="mb-2 text-lg font-semibold">
                            Recent Trips
                        </h2>
                        <Table
                            columns={recentTrips.columns}
                            data={{ data: recentTrips.trips }}
                        />
                    </div>
                    <div className="rounded-lg bg-gray-800 p-4 text-white shadow-md">
                        <h2 className="mb-2 text-lg font-semibold">
                            Notifications
                        </h2>
                        <Table
                            columns={driverNotifications.columns}
                            data={{ data: driverNotifications.notifications }}
                        />
                    </div>
                    <div className="rounded-lg bg-gray-800 p-4 text-white shadow-md">
                        <h2 className="mb-2 text-lg font-semibold">
                            Available Buses
                        </h2>
                        <Table
                            columns={availableBuses.columns}
                            data={{ data: availableBuses.buses }}
                        />
                    </div>
                </div>
            </MainBody>
        </AuthenticatedLayout>
    );
}
