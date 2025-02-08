import BarGraph from '@/Components/charts/BarGraph.jsx';
import LineGraph from '@/Components/charts/LineGraph.jsx';
import PieGraph from '@/Components/charts/PieGraph.jsx';
import MainBody from '@/Components/MainBody';
import Table from '@/Components/Table.jsx';
import TopBarStat from '@/Components/TopBarStat.jsx';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Dashboard({
    bookingStart,
    userRegistration,
    paymentGatewayUseData,
    totals,
    mostRecentPassengers,
    mostRecentBooking,
    userTypeData,
}) {
    console.log('totals ', totals);

    return (
        <AuthenticatedLayout>
            <MainBody>
                <div className="container mx-auto p-6">
                    <h1 className="mb-6 text-3xl font-semibold text-white">
                        Admin Dashboard
                    </h1>
                    <TopBarStat stats={totals.stats} />
                    <div className="mx-auto grid grid-cols-1 gap-1 py-3 pt-3 md:grid-cols-2 lg:grid-cols-2">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                            <div className="text-gray-900 dark:text-gray-100">
                                <h3 className="text-lg font-semibold">
                                    Bookings Overview
                                </h3>
                                <LineGraph
                                    lables={bookingStart.labels}
                                    input={bookingStart.input}
                                    label={bookingStart.label}
                                    header={bookingStart.header}
                                    title={bookingStart.title}
                                    backgroundColor={
                                        bookingStart.backgroundColor
                                    }
                                    borderColor={bookingStart.borderColor}
                                    titleColor={bookingStart.titleColor}
                                />
                            </div>
                        </div>

                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                            <div className="text-gray-900 dark:text-gray-100">
                                <h3 className="text-lg font-semibold">
                                    User Registration
                                </h3>
                                <BarGraph
                                    labels={userRegistration.labels}
                                    input={userRegistration.input}
                                    title={userRegistration.title}
                                    header={userRegistration.header}
                                    label={userRegistration.label}
                                    backgroundColor={
                                        userRegistration.backgroundColor
                                    }
                                    borderColor={userRegistration.borderColor}
                                    titleColor={userRegistration.titleColor}
                                    labelsColor={userRegistration.labelsColor}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mx-auto grid grid-cols-1 gap-5 py-3 pt-3 md:grid-cols-2 lg:grid-cols-2">
                        <div className="overflow-hidden bg-white p-2 shadow-sm sm:rounded-lg dark:bg-gray-800">
                            <div className="p-5 text-gray-900 dark:text-gray-100">
                                <h3 className="p-3 text-lg font-semibold">
                                    Payment Insight
                                </h3>
                                <PieGraph
                                    labels={paymentGatewayUseData.labels}
                                    input={paymentGatewayUseData.input}
                                    label={paymentGatewayUseData.label}
                                    colors={paymentGatewayUseData.colors}
                                />
                            </div>
                        </div>

                        <div className="overflow-hidden bg-white p-2 shadow-sm sm:rounded-lg dark:bg-gray-800">
                            <div className="p-5 text-gray-900 dark:text-gray-100">
                                <h3 className="p-3 text-lg font-semibold">
                                    Users Insight
                                </h3>
                                <PieGraph
                                    labels={userTypeData.labels}
                                    input={userTypeData.input}
                                    label={userTypeData.label}
                                    colors={userTypeData.colors}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="">
                        <div className="overflow-hidden bg-white p-3 shadow-sm sm:rounded-lg md:col-span-2 lg:col-span-1 dark:bg-gray-800">
                            <div className="text-gray-900 dark:text-gray-100">
                                <h3 className="text-lg font-semibold">
                                    Top 5 Most Recent Passengers
                                </h3>
                                <Table
                                    columns={mostRecentPassengers.columns}
                                    data={mostRecentPassengers?.passengers}
                                />
                            </div>
                        </div>

                        <div className="overflow-hidden bg-white p-3 shadow-sm sm:rounded-lg md:col-span-2 lg:col-span-1 dark:bg-gray-800">
                            <div className="text-gray-900 dark:text-gray-100">
                                <h3 className="text-lg font-semibold">
                                    Top 5 Most Recent Bookings
                                </h3>
                                <Table
                                    columns={mostRecentBooking.columns}
                                    data={mostRecentBooking?.bookings}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </MainBody>
        </AuthenticatedLayout>
    );
}
