import createLinkifyPlugin from 'draft-js-linkify-plugin';
import createHashtagPlugin from 'draft-js-hashtag-plugin';
import createEmojiPlugin from 'draft-js-emoji-plugin';

export default () => {
  const linkifyPlugin = createLinkifyPlugin();
  const hashtagPlugin = createHashtagPlugin();
  const emojiPlugin = createEmojiPlugin();

  const { EmojiSuggestions, EmojiSelect } = emojiPlugin;

  const plugins = [linkifyPlugin, hashtagPlugin, emojiPlugin];

  return { plugins, EmojiSuggestions, EmojiSelect };
};
