export default (styles) => {
  return (contentBlock) => {
    const type = contentBlock.getType();
    if (type === 'header-one') {
      return styles.h1;
    } else if (type === 'header-two') {
      return styles.h2;
    } else if (type === 'header-three') {
      return styles.h3;
    } else if (type === 'blockquote') {
      return styles.blockquote;
    } else if (type === 'pre') {
      return styles.pre;
    }
  };
};
