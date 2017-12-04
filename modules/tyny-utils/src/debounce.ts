/*
 * Based on
 * https://github.com/jashkenas/underscore
 *
 * Copyright (c) 2009-2017 Jeremy Ashkenas, DocumentCloud and Investigative
 * Reporters & Editors
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * Returns a function, that, as long as it continues to be invoked,
 * will not be triggered.
 *
 * The function will be called after it stops being called for N
 * milliseconds. If immediate is passed, trigger the function on the
 * leading edge, instead of the trailing.
 */
export default function debounce<T extends Function>(
  func: T,
  wait: number,
  immediate?: boolean
): T {
  let timeout: number | null = null;
  let args: IArguments | null = null;
  let context: any | null = null;
  let timestamp: number;
  let result: any;

  function later() {
    const last = Date.now() - timestamp;

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);

        if (!timeout) {
          context = args = null;
        }
      }
    }
  }

  return <any>function(this: any) {
    context = this;
    args = arguments;
    timestamp = Date.now();
    const callNow = immediate && !timeout;

    if (!timeout) {
      timeout = setTimeout(later, wait);
    }

    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}
