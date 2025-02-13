import BarGraph from '@/Components/charts/BarGraph.jsx';
import LineGraph from '@/Components/charts/LineGraph';
import PieGraph from '@/Components/charts/PieGraph.jsx';
import MainBody from '@/Components/MainBody.jsx';
import Table from '@/Components/Table.jsx';
import TopBarStat from '@/Components/TopBarStat.jsx';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';

export default function Dashboard({
    totals,
    bookingStart,
    paymentGatewayUseData,
    mostRecentBooking,
}) {
    return (
        <AuthenticatedLayout>
            <MainBody>
                <h1 className="mb-4 text-2xl font-bold text-white">
                    Passenger Dashboard
                </h1>
                <TopBarStat stats={totals.stats} />
                <div className="grid grid-cols-1 gap-1 md:grid-cols-2 lg:grid-cols-3">
                    <div className="flex h-60 items-center justify-center rounded-lg bg-gray-800 p-1">
                        <LineGraph
                            lables={bookingStart.labels}
                            input={bookingStart.input}
                            label={bookingStart.label}
                            header={bookingStart.header}
                            title={bookingStart.title}
                            backgroundColor={bookingStart.backgroundColor}
                            borderColor={bookingStart.borderColor}
                            titleColor={bookingStart.titleColor}
                        />
                    </div>
                    <div className="flex h-60 items-center justify-center rounded-lg bg-gray-800 p-4">
                        <BarGraph
                            labels={bookingStart.labels}
                            input={bookingStart.input}
                            title={bookingStart.title}
                            header={bookingStart.header}
                            label={bookingStart.label}
                            backgroundColor={bookingStart.backgroundColor}
                            borderColor={bookingStart.borderColor}
                            titleColor={bookingStart.titleColor}
                            labelsColor={bookingStart.labelsColor}
                        />
                    </div>
                    <div className="flex h-60 items-center justify-center rounded-lg bg-gray-800 p-4">
                        <PieGraph
                            labels={paymentGatewayUseData.labels}
                            input={paymentGatewayUseData.input}
                            label={paymentGatewayUseData.label}
                            colors={paymentGatewayUseData.colors}
                        />
                    </div>
                </div>
                <div className="mt-6 rounded-lg bg-gray-800 p-4">
                    <h2 className="mb-2 text-lg font-semibold text-gray-200">
                        Recent Trips
                    </h2>
                    <Table
                        columns={mostRecentBooking.columns}
                        data={mostRecentBooking?.bookings}
                    />
                </div>
                <div className="mt-6 rounded-lg bg-gray-800 p-4">
                    <h2 className="mb-2 text-lg font-semibold text-gray-200">
                        Recent Bookings
                    </h2>
                    <Table
                        columns={mostRecentBooking.columns}
                        data={mostRecentBooking?.bookings}
                    />
                </div>
            </MainBody>
        </AuthenticatedLayout>
    );
}
