import { KeyBindingUtil, getDefaultKeyBinding } from 'draft-js';

function keyBindingFunction(event) {
  if (
    KeyBindingUtil.hasCommandModifier(event) &&
    event.shiftKey &&
    event.key === 'x'
  ) {
    return 'strikethrough';
  }

  if (
    KeyBindingUtil.hasCommandModifier(event) &&
    event.shiftKey &&
    event.key === '7'
  ) {
    return 'ordered-list';
  }

  if (
    KeyBindingUtil.hasCommandModifier(event) &&
    event.shiftKey &&
    event.key === '8'
  ) {
    return 'unordered-list';
  }

  if (
    KeyBindingUtil.hasCommandModifier(event) &&
    event.shiftKey &&
    event.key === '9'
  ) {
    return 'blockquote';
  }

  return getDefaultKeyBinding(event);
}

export default keyBindingFunction;
