import * as React from 'react';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';

const TaskStatusPieChart = ({ taskStatusData }) => {
    const total = taskStatusData.reduce((sum, status) => sum + status.count, 0);

  const data = taskStatusData.map(status => ({
    value: status.count ,
    label: status.label,
    per:((status.count / total) * 100).toFixed(2)
  }));

  const size = {
    width: 500,
    height: 300,
  };

  return (
    <PieChart
      series={[
        {
          arcLabel: (item) => `${item.per} %`,
          arcLabelMinAngle: 45,
          data,
          highlightScope: { faded: 'global', highlighted: 'item' },
          faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' }
        },
      ]}
      sx={{
        [`& .${pieArcLabelClasses.root}`]: {
          fill: 'white',
          fontWeight: 'bold',
          fontSize:"14px"
        },
      }}
      {...size}
    />
  );
};

export default TaskStatusPieChart;
