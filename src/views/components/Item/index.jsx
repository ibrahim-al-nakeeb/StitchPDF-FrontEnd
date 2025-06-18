import React, {useEffect, useState} from 'react';
import {Box, IconButton, Typography} from "@mui/material";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteIcon from '@mui/icons-material/Delete';


const Item = ({ file, index, deleteHandler, openFileHandler, dragHandleProps }) => {
    const [fileName, setFileName] = useState('');

    useEffect(() => {
        const name = file.name;
        setFileName(name);
    }, [file, index]);


    const handleItemDelete = () => {
        if ( deleteHandler )
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
            <DragIndicatorIcon/>
            <Typography gutterBottom className={'file-name'} onClick={handleClick}>
                {fileName}
            </Typography>
            <IconButton color={'inherit'} aria-label="add to shopping cart" onClick={handleItemDelete}>
                <DeleteIcon />
            </IconButton>
        </Box>
    );
}

export default Item;