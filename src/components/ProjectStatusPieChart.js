import * as React from 'react';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';

const ProjectStatusPieChart = ({ statusData }) => {
    const total = statusData.reduce((sum, status) => sum + status.count, 0);
    
  const data = statusData.map(status => ({
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
          arcLabelMinAngle: 30,
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

export default ProjectStatusPieChart;
