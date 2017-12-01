import keyframes from '../../keyframes';

export default function fadeIn(): string {
  return keyframes('tynyFadeInKeyframes', {
    from: {
      opacity: '0',
    },
    to: {
      opacity: '1',
    },
  });
}
