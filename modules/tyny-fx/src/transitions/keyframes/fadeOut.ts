import keyframes from '../../keyframes';

export default function fadeOut(): string {
  return keyframes('tynyFadeOutKeyframes', {
    from: {
      opacity: '1',
    },
    to: {
      opacity: '0',
    },
  });
}
