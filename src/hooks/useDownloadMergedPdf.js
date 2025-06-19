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

            const status = response.status;

            if (status === 200) {
                const { presigned_url } = response.data;

                if (!presigned_url) {
                    throw new Error(response.data?.errorMessage || "Missing download URL");
                }

                const link = document.createElement('a');
                link.href = presigned_url;
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                return { success: true };
            }

            if (status === 202 || status === 400 || status === 404) {
                const message = response.data?.errorMessage || response.data?.message || "Request not fulfilled";
                const error = new Error(message);
                error.status = status;
                throw error;
            }

            throw new Error("Unexpected server response");

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
