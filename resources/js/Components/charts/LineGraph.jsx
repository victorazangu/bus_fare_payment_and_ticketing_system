import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
);

const LineGraph = ({
    lables,
    input,
    label,
    title,
    backgroundColor,
    borderColor,
    titleColor,
    labelsColor,
}) => {
    const data = {
        labels: lables,
        datasets: [
            {
                label: label,
                data: input,
                fill: false,
                borderColor: borderColor,
                backgroundColor: backgroundColor,
                tension: 0.1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: title,
                color: titleColor,
            },
        },
        elements: {
            line: {
                borderWidth: 3,
            },
            point: {
                radius: 5,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: labelsColor,
                },
            },
            y: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: labelsColor,
                },
            },
        },
        layout: {
            padding: 0,
        },
        tooltips: {
            titleColor: labelsColor,
            bodyColor: labelsColor,
        },
        backgroundColor: backgroundColor,
    };

    return <Line data={data} options={options} />;
};

export default LineGraph;
