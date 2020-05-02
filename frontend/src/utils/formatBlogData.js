function formatBlogData({
  name,
  description,
  bgImgUrl,
  imgAttribution,
  photo,
}) {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('description', description);

  if (photo || bgImgUrl) {
    if (imgAttribution) {
      formData.append('imgAttribution', imgAttribution);
    }
    if (photo) {
      formData.append('photo', photo);
    } else {
      formData.append('bgImgUrl', bgImgUrl);
    }
  }

  return formData;
}

export default formatBlogData;
