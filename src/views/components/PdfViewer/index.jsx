import React, {useState, useEffect} from "react";
import {Box} from "@mui/material";
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';


const PdfViewer = ({ document }) => {
    const layoutPlugin = defaultLayoutPlugin();
    const [objectUrl, setObjectUrl] = useState(null);

    useEffect(() => {
        if (!document) return;
        const url = typeof document === 'string' ? document : URL.createObjectURL(document);
        setObjectUrl(url);

        return () => URL.revokeObjectURL(url);
    }, [document]);

    if (!objectUrl) return null;

    return(
        <Box sx={{ width: "100%", height: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "inherit"}}>
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                    <Viewer fileUrl={objectUrl} plugins={[layoutPlugin]}/>
                </Worker>
            </Box>
        </Box>
    );
}

export default PdfViewer;