import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieGraph = ({ labels, input, label, colors }) => {
    const data = {
        labels: labels,
        datasets: [
            {
                label: label,
                data: input,
                backgroundColor: colors,
            },
        ],
    };

    return <Pie data={data} />;
};

export default PieGraph;
