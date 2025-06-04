import React from 'react';
import Box from '@mui/material/Box';
import './style.css'

const GlassyCard = ({ children }) => {
    return (
        <Box className={'glass'}>
            {children}
        </Box>

    );
};

export default GlassyCard;

