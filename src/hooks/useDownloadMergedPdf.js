import axios from 'axios';

const useDownloadMergedPdf = () => {
    const downloadMergedPdf = async (groupId) => {
        const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/download-url?groupId=${groupId}`, {
                headers: { 
                    'X-Api-Key': process.env.REACT_APP_API_KEY
                }
            }
        );
        
        const { presigned_url } = await response.data;

        const link = document.createElement('a');
        link.href = presignURL;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return { downloadMergedPdf };
};

export default useDownloadMergedPdf;
