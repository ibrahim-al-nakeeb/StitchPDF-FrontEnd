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

        if (!response.ok) throw new Error(`Failed to get signed URL: ${response.statusText}`);

        const { uploadUrl } = await response.json();

        const uploadRes = await fetch(uploadUrl, {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': file.type
            }
        });

        if (!uploadRes.ok) throw new Error(`Upload failed: ${uploadRes.statusText}`);

        return true;
    };

    return {
        uploadFile
    };
};

export default useUploadFile;
