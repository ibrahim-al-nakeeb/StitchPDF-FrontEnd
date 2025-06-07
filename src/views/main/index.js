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
import './style.css';
import {green} from "@mui/material/colors";

import ErrorDialog from '../components/ErrorDialog';
import FullScreenPdfDialog from '../components/FullScreenPdfDialog';
import DraggablePdfUploader from '../components/DraggablePdfUploader';

import { 
    useGenerateGroupID,
    useDownloadMergedPdf,
    useUploadFile
} from '../../hooks';


export default function Main() {
    const [groupId, setGroupId] = useState(null);
    const [pdfFiles, setPdfFiles] = useState([]);
    const [success, setSuccess] = useState(false);
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

    const buttonSx = {
        ...(success && {
            bgcolor: green[500],
            '&:hover': {
                bgcolor: green[700],
            },
        }),
    };

    const config = {...configFormat};

    useEffect(() => {
        generateTag();
    }, []);


    const handleClickOpenErrorDialog = () => {
        setErrorDialog(true);
    };

    const handleCloseErrorDialog = () => {
        setErrorDialog(false);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleSnackbarClose = () => {
        setErrorAlert(false);
    };

    const showAlert = (msg) => {
        setErrorMsg(msg);
        setErrorAlert(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDragEnd = (param) => {
        const srcI = param.source?.index;
        const destI = param.destination?.index;

        // Check if the drag and drop event has valid source and destination indices
        if (srcI !== undefined && destI !== undefined) {
            // Create a copy of the pdfFiles array
            const updatedPdfFiles = [...pdfFiles];
            // Remove the item from the source index
            const [removedItem] = updatedPdfFiles.splice(srcI, 1);
            // Insert the removed item at the destination index
            updatedPdfFiles.splice(destI, 0, removedItem);
            // Update the state with the new array order
            setPdfFiles(updatedPdfFiles);
        }
    };

    const generateTag = () => {
        const length = 30; // desired length of the tag
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let newTag = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            newTag += charset[randomIndex];
        }
        console.log(newTag);
        setTag(newTag);
    };


    const handleFileUpload = (pdfFile) => {

        const maxSize = 10 * 1024 * 1024; // 5 MB in bytes
        if (pdfFile.size > maxSize) {
            showAlert("File size exceeds the limit of 10MB");
            return;
        }

        const fileReader = new FileReader();

        fileReader.onload = () => {
            const dataUrl = fileReader.result;

            setPdfFiles((prevPdfFiles) => {
                if (prevPdfFiles.length >= 5) {
                    showAlert("You can't select more than 5 files");
                    return [...prevPdfFiles];
                } else if (prevPdfFiles.some((file) => file.document === dataUrl)) {
                    showAlert("The file is already selected");
                    return [...prevPdfFiles];
                } else
                    return [
                        ...prevPdfFiles,
                        {
                            name: pdfFile.name,
                            type: pdfFile.type,
                            document: dataUrl,
                            file: pdfFile
                        },
                    ];
            });
        };
        fileReader.readAsDataURL(pdfFile);
    };


    const handleFileDelete = (index) => {
        setPdfFiles((prevPdfFiles) => prevPdfFiles.filter((_, i) => i !== index));
    };

    const handleDocumentPreview = (index) => {
        setOpenDocument(pdfFiles[index]);
        handleClickOpen();
    };


    const uploadFiles = async () => {
        for (const pdfFile of pdfFiles) {
            const index = pdfFiles.indexOf(pdfFile);
            config.url = `https://pynikv8l73.execute-api.eu-west-1.amazonaws.com/dev/merge-wizard-pdf-preprocess-files/${tag}${index}.${pdfFile.type.split("/")[1]}`;
            config.headers["Content-Type"] = `${pdfFile.type}`;
            config.data = pdfFile.file;
            try {
               await axios.request(config);
            } catch (error) {
                setErrorMsg(error.message);
                setErrorStatus(error.code);
                setSuccess(false);
                setLoading(false);
                handleClickOpenErrorDialog();
            }
        }
    }

    const handleButtonClick = async () => {

        if (downloaded) {
            setDownloaded(false);
            setPdfFiles([]);
        } else if (success && !downloaded) {
            setDownloaded(true);
            setSuccess(false);
            try {
                const response = await axios(`https://pynikv8l73.execute-api.eu-west-1.amazonaws.com/dev/merged-pdf?tag=${tag}`, {headers: {
                        'X-Api-Key': process.env.REACT_APP_SECRET_KEY
                    }});
                const data = response?.data?.body;
                const presignURL = JSON.parse(data).presigned_url;
                const link = document.createElement('a');
                link.href = presignURL;
                link.target = "_blank";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

            } catch (error) {
                setErrorMsg(error.message);
                setErrorStatus(error.code);
                setSuccess(false);
                setLoading(false);
                handleClickOpenErrorDialog();
            }
            generateTag();
        } else if (!loading) {
            setSuccess(false);
            setLoading(true);

            if(pdfFiles.length < 2) {
                setTimeout(() => {
                    showAlert("You need to select 2 files or more.");
                    setSuccess(false);
                    setLoading(false);
                }, 400);
                return;
            }
            config.headers.tag = `session_tag=${tag}`;
            await uploadFiles();

            config.url = `https://pynikv8l73.execute-api.eu-west-1.amazonaws.com/dev/merge-wizard-pdf-preprocess-files/${tag}.csv`;
            config.headers["Content-Type"] = 'text/csv';
            const csvContent = `session_tag\n${tag}`;
            const csvBlob = new Blob([csvContent]);
            config.data = new File([csvBlob], `${tag}.csv`, {type: "text/csv"});
            try {
                await axios.request(config);
                setSuccess(true);
                setLoading(false);
            } catch (error) {
                setErrorMsg(error.message);
                setErrorStatus(error.code);
                setSuccess(false);
                setLoading(false);
                handleClickOpenErrorDialog();
            }

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
                        sx={buttonSx}
                        disabled={loading}
                        onClick={handleButtonClick}
                        startIcon={ success ? <DownloadIcon/> : downloaded ? <RefreshIcon/> : <MergeIcon/>}
                    >
                        {success ? "Download" : downloaded ? "Refresh" : "Merge"}
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
                title={statusError}
                message={errorMessage}
            />
                </Alert>
            </Snackbar>
        </Box>
    );
}