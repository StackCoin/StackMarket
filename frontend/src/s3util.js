export default async (data) => {
  const uploadData = await (
    await fetch(`${process.env.REACT_APP_S3_SIGN_URL}/url/put`)
  ).json();
  return {
    uploading: fetch(uploadData.uploadURL, data),
    specialName: uploadData.specialName,
  };
};
