import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import {Box} from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const style = {
    color: 'white',
    border: '2px dashed white',
    padding: '30px',
    textAlign: 'center',
    borderRadius: '20px',
    height: '15dvh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    '&:hover' : {
        opacity: 0.8,
        cursor: "pointer"
    },
    '&.disabled': {
        opacity: 0.5,
        cursor: 'not-allowed',
    }

}

const Dropzone = ({ handler }) => {
    const onDrop = useCallback((acceptedFiles) => {
        if (handler && acceptedFiles.length > 0) {
            handler(acceptedFiles);
        }
    }, [handler]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        maxFiles: 5,
        accept: {
            'application/pdf': ['.pdf']
        },
        multiple: true,
    });

    return (
        <Box {...getRootProps()} sx={style}>
            <input {...getInputProps()} />
            <CloudUploadIcon sx={{fontSize: '80px'}}/>
            <h3>Drag and drop your PDF files here, or click to select and stitch them</h3>
        </Box>
    );
};

export default Dropzone;