import axios from 'axios';

export const useDownloadMergedPdf = () => {
    const downloadMergedPdf = async (groupId) => {
        const response = await axios.get(
            `${process.env.REACT_APP_GET_MERGED_URL}/download-url?groupId=${groupId}`,
            { headers: { 'X-Api-Key': process.env.REACT_APP_SECRET_KEY } }
        );
        const data = response?.data?.body;
        const presignURL = JSON.parse(data).presigned_url;

        const link = document.createElement('a');
        link.href = presignURL;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return { downloadMergedPdf };
};