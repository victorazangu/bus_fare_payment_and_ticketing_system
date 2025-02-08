import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
);

const BarGraph = ({
    labels,
    input,
    title,
    label,
    backgroundColor,
    borderColor,
    titleColor,
    labelsColor,
}) => {
    const data = {
        labels: labels,
        datasets: [
            {
                label: label,
                data: input,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 1,
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
            bar: {
                borderRadius: 5,
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

        backgroundColor: 'transparent',
    };

    return <Bar data={data} options={options} />;
};

export default BarGraph;
