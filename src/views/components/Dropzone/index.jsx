import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import {Box} from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const Dropzone = ({ handler, disabled }) => {
    const onDrop = useCallback((acceptedFiles) => {
        if (handler && acceptedFiles.length > 0) {
            handler(acceptedFiles);
        }
    }, [handler]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 5,
        accept: {
            'application/pdf': ['.pdf']
        },
        multiple: true,
    });

    return (
        <Box
            {...getRootProps()}
            className={`dropzone ${disabled ? 'disabled' : ''}`}
        >
            <input {...getInputProps({ disabled })}/>
            <CloudUploadIcon sx={{fontSize: '80px'}}/>
            <h3>
                {isDragActive && !disabled ? 
                    'Drop the files here...'
                :
                disabled ?
                    ''
                :
                    'Drag and drop your PDF files here, or click to select and stitch them'
                }
            </h3>
        </Box>
    );
};

export default Dropzone;
