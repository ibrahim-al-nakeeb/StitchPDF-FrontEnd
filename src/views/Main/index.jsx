import React, { useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Snackbar
} from "@mui/material";
import GlassyCard from "../components/GlassyCard";
import MergeIcon from '@mui/icons-material/Merge';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import FileUploadIcon from '@mui/icons-material/FileUpload';

import ErrorDialog from '../components/ErrorDialog';
import FullScreenPdfDialog from '../components/FullScreenPdfDialog';
import DraggablePdfUploader from '../components/DraggablePdfUploader';

import { sleep, createSessionMetadataFile } from '../../utils';

import { Stage } from '../../constants';

import { 
    useGenerateGroupID,
    useDownloadMergedPdf,
    useUploadFile
} from '../../hooks';


const Main = () => {
    const [groupId, setGroupId] = useState(null);
    const [pdfFiles, setPdfFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [openViewer, setOpenViewer] = useState(false);
    const [statusError, setStatusError] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [openErrorDialog, setOpenErrorDialog] = useState(false);
    const [currentDocument, setCurrentDocument] = useState(null);
    const [stage, setStage] = useState(Stage.READY_TO_MERGE);

    const { generateGroupID } = useGenerateGroupID();
    const { downloadMergedPdf } = useDownloadMergedPdf();
    const { uploadFile } = useUploadFile();

    const handleError = (error) => {
        setErrorMessage(error.message);
        setStatusError(error.status);
        setLoading(false);
        setOpenErrorDialog(true);
    };

    const handleReset = () => {
        setPdfFiles([]);
        setStage(Stage.READY_TO_MERGE);
    };

    const handleDownload = async () => {
        setLoading(true);
        setStage(Stage.DOWNLOADING);
        try {
            await downloadMergedPdf(groupId);
            setStage(Stage.READY_TO_REFRESH);
        } catch (error) {
            setStage(Stage.READY_TO_DOWNLOAD);
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUploadAndTriggerMerge = async () => {
        setLoading(true);

        if (pdfFiles.length < 2) {
            showAlert('You need to select 2 files or more.');
            setLoading(false);
            return;
        }

        try {
            setStage(Stage.UPLOADING);
            const newGroupId = await generateGroupID();
            setGroupId(newGroupId);

            for (const file of pdfFiles) {
                const success = await uploadFile(file, newGroupId);
                if (!success) throw new Error("Failed to upload one of the PDF files");
            }

            const sessionFile = createSessionMetadataFile(newGroupId);
            const metaSuccess = await uploadFile(sessionFile, newGroupId);
            if (!metaSuccess) throw new Error("Failed to upload session metadata file");
            setStage(Stage.MERGING);

            await sleep(2000);

            setStage(Stage.READY_TO_DOWNLOAD);
        } catch (error) {
            setStage(Stage.READY_TO_MERGE);
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
        if (stage === Stage.READY_TO_REFRESH) {
            handleReset();
        } else if (stage === Stage.READY_TO_DOWNLOAD) {
            await handleDownload();
        } else if (stage === Stage.READY_TO_MERGE) {
            await handleUploadAndTriggerMerge();
        }
    };

    const getStartIcon = () => {
        if (stage === Stage.READY_TO_DOWNLOAD || stage === Stage.DOWNLOADING) return <DownloadIcon />;
        if (stage === Stage.READY_TO_REFRESH) return <RefreshIcon />;
        if (stage === Stage.UPLOADING) return <FileUploadIcon />;
        return <MergeIcon />;
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
                        className={stage === Stage.READY_TO_DOWNLOAD ? 'button-success' : ''}
                        onClick={handleButtonClick}
                        startIcon={getStartIcon()}
                        loading={loading}
                        loadingPosition="start"
                    >
                        {stage}
                    </Button>
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
                onRestart={() => {
                    handleReset();
                    setOpenErrorDialog(false);
                }}
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