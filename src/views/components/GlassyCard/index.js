import React from 'react';
import Box from '@mui/material/Box';

const GlassyCard = ({ children }) => {
    return (
        <Box className={'glass'}>
            {children}
        </Box>

    );
};

export default GlassyCard;

