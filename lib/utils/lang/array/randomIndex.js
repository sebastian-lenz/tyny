import { randomInt } from '../number/randomInt';
export function randomIndex(value) {
    return randomInt(0, value.length - 1);
}
