import React, {forwardRef} from 'react';

import {
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    Slide
} from '@mui/material';

import PdfViewer from '../pdfviewer';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props}/>;
});

const FullScreenPdfDialog = ({ open, onClose, document }) => {
    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={onClose}
            aria-describedby="alert-dialog-slide-description"
            fullScreen
        >
            <DialogContent
                sx={{ padding: 0, height: "95vh", position: "relative" }}
            >
                {document ? <PdfViewer document={document} /> : null}
            </DialogContent>
            <DialogActions sx={{ height: "5vh" }}>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default FullScreenPdfDialog;