import axios from 'axios';

export const useGenerateGroupID = () => {
    const generateGroupID = async () => {
        const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/group-id`,
            {
                headers: {
                    'X-Api-Key': process.env.REACT_APP_API_KEY,
                },
            }
        );
        return response.data?.groupId;
    };

    return {
        generateGroupID,
    };
};
