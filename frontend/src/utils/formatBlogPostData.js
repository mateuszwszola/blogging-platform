import { convertToRaw } from 'draft-js';

function formatBlogPostData({
  title,
  editorState,
  tags,
  photo,
  bgImgUrl,
  imgAttribution,
}) {
  const formattedData = {
    title,
    body: JSON.stringify({
      content: convertToRaw(editorState.getCurrentContent()),
    }),
    tags: tags
      .split(',')
      .filter((t) => t.trim())
      .join(','),
  };

  if (photo || bgImgUrl) {
    if (imgAttribution) {
      formattedData.imgAttribution = imgAttribution;
    }
    if (photo) {
      formattedData.photo = photo;
    } else {
      formattedData.bgImgUrl = bgImgUrl;
    }
  }

  const formData = new FormData();

  for (const field in formattedData) {
    formData.append(field, formattedData[field]);
  }

  return formData;
}

export default formatBlogPostData;
