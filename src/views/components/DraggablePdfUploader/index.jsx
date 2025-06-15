import React from 'react';
import { Box } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Dropzone from '../Dropzone';
import Item from '../Item';

const DraggablePdfUploader = ({
    pdfFiles,
    setPdfFiles,
    onUploadError,
    handleDocumentPreview
}) => {
    const handleDragEnd = (param) => {
        const srcI = param.source?.index;
        const destI = param.destination?.index;

        if (srcI !== undefined && destI !== undefined) {
            const updatedPdfFiles = [...pdfFiles];
            const [removedItem] = updatedPdfFiles.splice(srcI, 1);
            updatedPdfFiles.splice(destI, 0, removedItem);
            setPdfFiles(updatedPdfFiles);
        }
    };

    const handleFileDelete =(index) => {
        setPdfFiles((prevPdfFiles) => prevPdfFiles.filter((_, i) => i !== index));
    };

    const handleFileUpload = (newFiles) => {
        const MAX_FILE_SIZE_MB = 10;
        const MAX_FILE_COUNT = 5;

        const errors = [];
        const validFiles = [];

        const currentCount = pdfFiles.length;

        for (const file of newFiles) {
            const sizeInMB = file.size / (1024 * 1024);

            if (sizeInMB > MAX_FILE_SIZE_MB) {
                errors.push(`"${file.name}" exceeds the 10MB size limit.`);
                continue;
            }

            const isDuplicate = pdfFiles.some(
                (existing) => existing.name === file.name && existing.size === file.size
            ) || validFiles.some(
                (alreadyAdded) => alreadyAdded.name === file.name && alreadyAdded.size === file.size
            );

            if (isDuplicate) {
                errors.push(`"${file.name}" has already been uploaded.`);
                continue;
            }

            if (currentCount + validFiles.length >= MAX_FILE_COUNT) {
                errors.push(`You can upload up to ${MAX_FILE_COUNT} files total.`);
                break; // Stop adding more files
            }

            validFiles.push(file);
        }

        if (errors.length > 0 && onUploadError) {
            onUploadError(errors);
        }

        if (validFiles.length > 0) {
            setPdfFiles((prev) => [...prev, ...validFiles]);
        }
    };

    return (
        <Box className="container">
            <Dropzone handler={handleFileUpload} />

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="droppable-files">
                    {(provided) => (
                        <Box
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            sx={{ width: "100%", mt: 3 }}
                        >
                            {pdfFiles.map((pdfFile, index) => (
                                <Draggable
                                    key={index}
                                    draggableId={`item-${index}`}
                                    index={index}
                                >
                                    {(provided) => (
                                        <Box
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                        >
                                            <Item
                                                file={pdfFile}
                                                index={index}
                                                deleteHandler={handleFileDelete}
                                                openFileHandler={handleDocumentPreview}
                                                dragHandleProps={provided.dragHandleProps}
                                            />
                                        </Box>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </Box>
                    )}
                </Droppable>
            </DragDropContext>
        </Box>
    );
};

export default DraggablePdfUploader;