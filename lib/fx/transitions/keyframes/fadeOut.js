import { memoize } from '../../../utils/lang/function/memoize';
import { keyframes } from '../../keyframes';
export var fadeOut = memoize(function fadeOut() {
    return keyframes('tynyFadeOutKeyframes', {
        from: {
            opacity: '1',
            visibility: 'inherit',
        },
        to: {
            opacity: '0',
        },
    });
});
