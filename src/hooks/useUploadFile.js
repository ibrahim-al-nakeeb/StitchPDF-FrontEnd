export const useUploadFile = () => {
    const uploadFile = async (file, groupId) => {
        const filename = encodeURIComponent(file.name);

        const signUrl = `${process.env.REACT_APP_UPLOAD_SIGN_URL}/upload-url?filename=${filename}&tag=groupId=${groupId}`;
        const response = await fetch(signUrl, {
            headers: {
                'X-Api-Key': process.env.REACT_APP_API_KEY
            }
        });

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
