import axios from 'axios';


const useUploadFile = () => {
    const uploadFile = async (file, groupId) => {
        try {
            if (!file || !groupId) {
                console.error("Missing file or groupId");
                throw new Error("Missing required parameters");
            }

            const filename = `${groupId}/${file.name}`;
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/upload-url`, {
                    params: { filename },
                    headers: {
                        'X-Api-Key': process.env.REACT_APP_API_KEY
                    }
                }
            );

            const { presigned_url } = await response.data;
            
            if (!presigned_url) {
                throw new Error("No signed URL returned by the server");
            }

            await axios.put(presigned_url, file, {
                headers: {
                    'Content-Type': file.type
                }
            });
            return true;

        } catch (error) {            
            const message = error.response?.data?.errorMessage || error.message || 'Unknown error';
            const status = error.response?.status;

            const customError = new Error(message);
            customError.status = status;

            console.error("Error in uploadFile:", message);
            throw customError;
        }
    };

    return {
        uploadFile
    };
};

export default useUploadFile;
