import axios from 'axios';

export const useGenerateGroupID = () => {
    const generateGroupID = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/group-id`, {
                    headers: {
                        'X-Api-Key': process.env.REACT_APP_API_KEY,
                    }
                }
            ); 

            return response.data.groupId;
        } catch (error) {
            const message = error.response?.data?.errorMessage || error.message || 'Unknown error';
            const status = error.response?.status || 500;

            const customError = new Error(message);
            customError.status = status;

            console.error("Failed to generate ID:", message);
            throw customError;
        }
    };

    return {
        generateGroupID,
    };
};
