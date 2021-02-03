import { memoize } from '../../../utils/lang/function/memoize';
import { keyframes } from '../../keyframes';
export var fadeIn = memoize(function fadeIn() {
    return keyframes('tynyFadeInKeyframes', {
        from: {
            opacity: '0',
        },
        to: {
            opacity: '1',
        },
    });
});
