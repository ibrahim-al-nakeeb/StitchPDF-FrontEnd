export const createSessionMetadataFile = (groupId) => {
    const jsonBlob = new Blob(
        [JSON.stringify({ session_tag: groupId }, null, 2)],
        { type: 'application/json' }
    );
    const file = new File([jsonBlob], `${groupId}.json`, {
        type: 'application/json'
    });
    return file;
};