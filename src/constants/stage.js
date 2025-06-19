const Stage = {
  READY_TO_MERGE: 'Merge',          // User can start the merge process
  UPLOADING: 'Uploading...',        // Files are being uploaded to S3
  MERGING: 'Merging...',            // Merge Lambda is processing the files
  READY_TO_DOWNLOAD: 'Download',    // Merge completed — file is ready to download
  DOWNLOADING: 'Downloading...',    // User initiated the download
  READY_TO_REFRESH: 'Refresh',      // After download — user can refresh for updates or redo
};

export default Stage;
