// ProgressBarWithLabel.js
import React from 'react';
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function ProgressBarWithLabel({ value }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" value={value} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${value}%`}</Typography>
      </Box>
    </Box>
  );
}

ProgressBarWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
 
};

export default ProgressBarWithLabel;
