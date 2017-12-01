/*
 * TERMS OF USE - EASING EQUATIONS
 *
 * Open source under the BSD License.
 *
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import { EasingFunction } from '../index';

export function createEaseInOutElastic(
  amplitude?: number,
  period?: number
): EasingFunction {
  const result: EasingFunction = <any>function easeInOutElastic(
    time: number,
    base: number,
    change: number,
    duration: number
  ): number {
    let scale: number;
    if (time == 0) return base;
    if ((time /= duration / 2) == 2) return base + change;

    if (!period) period = duration * (0.3 * 1.5);
    if (!amplitude || amplitude < Math.abs(change)) {
      amplitude = change;
      scale = period / 4;
    } else {
      scale = period / (2 * Math.PI) * Math.asin(change / amplitude);
    }

    if (time < 1) {
      return (
        -0.5 *
          (amplitude *
            Math.pow(2, 10 * (time -= 1)) *
            Math.sin((time * duration - scale) * (2 * Math.PI) / period)) +
        base
      );
    }

    return (
      amplitude *
        Math.pow(2, -10 * (time -= 1)) *
        Math.sin((time * duration - scale) * (2 * Math.PI) / period) *
        0.5 +
      change +
      base
    );
  };

  result.toCSS = () => 'ease-in-out';
  return result;
}

const easeInOutElastic = createEaseInOutElastic();
export default easeInOutElastic;
