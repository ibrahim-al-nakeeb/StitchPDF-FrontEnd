import axios from 'axios';

const useDownloadMergedPdf = () => {
    const downloadMergedPdf = async (groupId) => {
        try {
            if (!groupId) {
                console.error("Missing  or groupId");
                throw new Error("Missing required parameters");
            }

            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/download-url?groupId=${groupId}`, {
                    headers: { 
                        'X-Api-Key': process.env.REACT_APP_API_KEY
                    }
                }
            );

            const { presigned_url } = await response.data;

            if(!presigned_url) {
                throw new Error(response.data?.errorMessage || response.data?.message)
            }

            const link = document.createElement('a');
            link.href = presigned_url;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {            
            const message = error.response?.data?.errorMessage || error.message || 'Unknown error';
            const status = error.response?.status;

            const customError = new Error(message);
            customError.status = status;

            console.error("Error in uploadFile:", message);
            throw customError;
        }
    };

    return { downloadMergedPdf };
};

export default useDownloadMergedPdf;
