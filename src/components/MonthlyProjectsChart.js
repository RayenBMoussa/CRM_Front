import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlyProjectsChart = ({ monthlyProjects }) => {
    const data = {
        labels: Object.keys(monthlyProjects),
        datasets: [
            {
                label: 'Projects Count',
                data: Object.values(monthlyProjects),
                backgroundColor: 'rgb(192, 100, 223,0.7)',
                borderColor: 'rgb(192, 100, 223, 1)',
                borderWidth: 1,
            },
        ],
    };
    const maxCount = Math.max(...Object.values(monthlyProjects));
    const options = {   
        responsive: true,
        
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,

            },
            
        },
        scales: {
            y: {
                beginAtZero: true,
                max: Math.ceil(maxCount / 5) * 5, // Round up to the nearest 5
                ticks: {
                    stepSize: 1,
                },
            },
        },

    };

    return (
        
            <Bar data={data} options={options} />
        
    );
};

export default MonthlyProjectsChart;
