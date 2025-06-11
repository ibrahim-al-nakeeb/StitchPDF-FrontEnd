import React, {useState} from 'react';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Snackbar
} from "@mui/material";
import GlassyCard from "../components/GlassyCard";
import MergeIcon from '@mui/icons-material/Merge';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import { green } from "@mui/material/colors";

import ErrorDialog from '../components/ErrorDialog';
import FullScreenPdfDialog from '../components/FullScreenPdfDialog';
import DraggablePdfUploader from '../components/DraggablePdfUploader';

import { createSessionMetadataFile } from './helpers';

import { 
    useGenerateGroupID,
    useDownloadMergedPdf,
    useUploadFile
} from '../../hooks';


const Main = () => {
    const [groupId, setGroupId] = useState(null);
    const [pdfFiles, setPdfFiles] = useState([]);
    const [mergeSuccess, setMergeSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [openViewer, setOpenViewer] = useState(false);
    const [downloaded, setDownloaded] = useState(false);
    const [statusError, setStatusError] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [openErrorDialog, setOpenErrorDialog] = useState(false);
    const [currentDocument, setCurrentDocument] = useState(null);

    const { generateGroupID } = useGenerateGroupID();
    const { downloadMergedPdf } = useDownloadMergedPdf();
    const { uploadFile } = useUploadFile();

    const handleError = (error) => {
        setErrorMessage(error.message);
        setStatusError(error.code);
        setMergeSuccess(false);
        setLoading(false);
        setOpenErrorDialog(true);
    };


    const handleReset = () => {
        setDownloaded(false);
        setPdfFiles([]);
    };

    const handleDownload = async () => {
        setDownloaded(true);
        setMergeSuccess(false);
        try {
            await downloadMergedPdf(groupId);
        } catch (error) {
            handleError(error);
        }
    };

    const handleUploadAndTriggerMerge = async () => {
        setMergeSuccess(false);
        setLoading(true);

        if (pdfFiles.length < 2) {
            showAlert('You need to select 2 files or more.');
            setLoading(false);
            return;
        }

        try {
            const newGroupId = await generateGroupID();
            setGroupId(newGroupId);

            if (!newGroupId) {
                setLoading(false);
                return;
            }

            for (const file of pdfFiles) {
                const success = await uploadFile(file, newGroupId);
                if (!success) throw new Error("Failed to upload one of the PDF files");
            }

            const sessionFile = createSessionMetadataFile(newGroupId);
            const metaSuccess = await uploadFile(sessionFile, newGroupId);
            if (!metaSuccess) throw new Error("Failed to upload session metadata file");

            setMergeSuccess(true);
        } catch (error) {
            console.error(error);
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    const showAlert = (message) => {
        setErrorMessage(message);
        setOpenAlert(true);
    };

    const handleButtonClick = async () => {
        if (downloaded) {
            handleReset();
        } else if (mergeSuccess && !downloaded) {
            await handleDownload();
        } else if (!loading) {
            await handleUploadAndTriggerMerge();
        }
    };


    return(
        <Box className={'main'}>
            <GlassyCard>
                <DraggablePdfUploader
                    pdfFiles={pdfFiles}
                    setPdfFiles={setPdfFiles}
                    onUploadError={(errors) => {
                        showAlert(errors.map(err => err).join('\n'));
                    }}
                    handleDocumentPreview={(index) => {
                        setCurrentDocument(pdfFiles[index]);
                        setOpenViewer(true);
                    }}
                />
                <Box sx={{ m: 1, position: 'relative' , mb: 3}}>
                    <Button
                        variant="contained"
                        className={mergeSuccess ? 'button-success' : ''}
                        disabled={loading}
                        onClick={handleButtonClick}
                        startIcon={ mergeSuccess ? <DownloadIcon/> : downloaded ? <RefreshIcon/> : <MergeIcon/>}
                    >
                        {mergeSuccess ? "Download" : downloaded ? "Refresh" : "Merge"}
                    </Button>
                    {loading && (
                        <CircularProgress
                            size={24}
                            sx={{
                                color: green[500],
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                marginTop: '-12px',
                                marginLeft: '-12px',
                            }}
                        />
                    )}
                </Box>
            </GlassyCard>
            <FullScreenPdfDialog
                open={openViewer}
                onClose={() => {
                    URL.revokeObjectURL(currentDocument);
                    setOpenViewer(false);
                }}
                document={currentDocument}
            />
            <ErrorDialog
                open={openErrorDialog}
                onClose={() => setOpenErrorDialog(false)}
                title={`Something went wrong${statusError ? ` (Error ${statusError})` : ''}`}
                message={errorMessage}
            />
            <Snackbar open={openAlert} autoHideDuration={6000} onClose={() => setOpenAlert(false)}>
                <Alert severity="error" variant="filled" onClose={() => setOpenAlert(false)} sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default Main;