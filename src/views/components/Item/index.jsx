import React, {useEffect, useState} from 'react';
import {Box, IconButton, Typography, Stack} from "@mui/material";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';


const Item = ({
    file,
    index,
    deleteHandler,
    openFileHandler,
    dragHandleProps,
    disabled 
}) => {
    const [fileName, setFileName] = useState('');

    useEffect(() => {
        const name = file.name;
        setFileName(name);
    }, [file, index]);


    const handleItemDelete = () => {
        if (deleteHandler)
            deleteHandler(index);
    }

    const handleClick = () => {
        if (openFileHandler)
            openFileHandler(index);
    }

    return (
        <Box
            className={`file-card ${disabled ? 'disabled' : ''}`}
            {...dragHandleProps}
        >
            <Stack
                direction="row"
                spacing={4}
                sx={{
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <DragIndicatorIcon/>
                <Typography gutterBottom className={'file-name' + disabled ? ' disabled' : ''} onClick={handleClick} sx={{ m:0 }}>
                    {fileName}
                </Typography>
            </Stack>
            <IconButton color={'inherit'} aria-label="add to shopping cart" onClick={handleItemDelete} disabled={disabled}>
                <RemoveCircleIcon />
            </IconButton>
        </Box>
    );
}

export default Item;
