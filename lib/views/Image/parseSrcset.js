export function parseSrcset(input) {
    function isSpace(c) {
        return (c === '\u0020' ||
            c === '\u0009' ||
            c === '\u000A' ||
            c === '\u000C' ||
            c === '\u000D');
    }
    function collectCharacters(regEx) {
        const match = regEx.exec(input.substring(pos));
        if (!match) {
            return '';
        }
        const chars = match[0];
        pos += chars.length;
        return chars;
    }
    const inputLength = input.length;
    const regexLeadingSpaces = /^[ \t\n\r\u000c]+/;
    const regexLeadingCommasOrSpaces = /^[, \t\n\r\u000c]+/;
    const regexLeadingNotSpaces = /^[^ \t\n\r\u000c]+/;
    const regexTrailingCommas = /[,]+$/;
    const regexNonNegativeInteger = /^\d+$/;
    const regexFloatingPoint = /^-?(?:[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/;
    let url = '';
    let descriptors = [];
    let pos = 0;
    const candidates = [];
    while (true) {
        collectCharacters(regexLeadingCommasOrSpaces);
        if (pos >= inputLength) {
            return candidates;
        }
        url = collectCharacters(regexLeadingNotSpaces);
        descriptors = [];
        if (url && url.slice(-1) === ',') {
            url = url.replace(regexTrailingCommas, '');
            parseDescriptors();
        }
        else {
            tokenize();
        }
    }
    function tokenize() {
        collectCharacters(regexLeadingSpaces);
        let currentDescriptor = '';
        let state = 1;
        while (true) {
            const c = input.charAt(pos);
            if (state === 1) {
                if (isSpace(c)) {
                    if (currentDescriptor) {
                        descriptors.push(currentDescriptor);
                        currentDescriptor = '';
                        state = 0;
                    }
                }
                else if (c === ',') {
                    pos += 1;
                    if (currentDescriptor) {
                        descriptors.push(currentDescriptor);
                    }
                    parseDescriptors();
                    return;
                }
                else if (c === '\u0028') {
                    currentDescriptor = currentDescriptor + c;
                    state = 2;
                }
                else if (c === '') {
                    if (currentDescriptor) {
                        descriptors.push(currentDescriptor);
                    }
                    parseDescriptors();
                    return;
                }
                else {
                    currentDescriptor = currentDescriptor + c;
                }
            }
            else if (state === 2) {
                if (c === ')') {
                    currentDescriptor = currentDescriptor + c;
                    state = 1;
                }
                else if (c === '') {
                    descriptors.push(currentDescriptor);
                    parseDescriptors();
                    return;
                }
                else {
                    currentDescriptor = currentDescriptor + c;
                }
            }
            else if (state === 0) {
                if (isSpace(c)) {
                }
                else if (c === '') {
                    parseDescriptors();
                    return;
                }
                else {
                    state = 1;
                    pos -= 1;
                }
            }
            pos += 1;
        }
    }
    function parseDescriptors() {
        var pError = false, w, d, h, i, desc;
        for (i = 0; i < descriptors.length; i++) {
            const desc = descriptors[i];
            const lastChar = desc[desc.length - 1];
            const value = desc.substring(0, desc.length - 1);
            const intVal = parseInt(value, 10);
            const floatVal = parseFloat(value);
            if (regexNonNegativeInteger.test(value) && lastChar === 'w') {
                if (w || d) {
                    pError = true;
                }
                if (intVal === 0) {
                    pError = true;
                }
                else {
                    w = intVal;
                }
            }
            else if (regexFloatingPoint.test(value) && lastChar === 'x') {
                if (w || d || h) {
                    pError = true;
                }
                if (floatVal < 0) {
                    pError = true;
                }
                else {
                    d = floatVal;
                }
            }
            else if (regexNonNegativeInteger.test(value) && lastChar === 'h') {
                if (h || d) {
                    pError = true;
                }
                if (intVal === 0) {
                    pError = true;
                }
                else {
                    h = intVal;
                }
            }
            else {
                pError = true;
            }
        }
        if (!pError) {
            const candidate = { url };
            if (w) {
                candidate.w = w;
            }
            if (d) {
                candidate.d = d;
            }
            if (h) {
                candidate.h = h;
            }
            candidates.push(candidate);
        }
        else if (console && console.log) {
            console.log("Invalid srcset descriptor found in '" + input + "' at '" + desc + "'.");
        }
    }
}
