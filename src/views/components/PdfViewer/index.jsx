import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

const PdfViewer = ({ document }) => {
    const layoutPlugin = defaultLayoutPlugin();
    const [objectUrl, setObjectUrl] = useState(null);

    useEffect(() => {
        if (!document) return;

        const url = typeof document === 'string'
            ? document
            : URL.createObjectURL(document);

        setObjectUrl(url);

        return () => {
            if (typeof document !== 'string') {
                URL.revokeObjectURL(url);
            }
        };
    }, [document]);

    if (!objectUrl) return null;

    return (
        <Box sx={{ width: "100%", height: "100%" }}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "inherit"
                }}
            >
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                    <Viewer fileUrl={objectUrl} plugins={[layoutPlugin]} />
                </Worker>
            </Box>
        </Box>
    );
};

export default PdfViewer;
