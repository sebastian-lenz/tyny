export function exec(rawUrl, rawRoute, opts) {
    let reg = /(?:\?([^#]*))?(#.*)?$/, c = rawUrl.match(reg), matches = {}, ret;
    if (c && c[1]) {
        let p = c[1].split('&');
        for (let i = 0; i < p.length; i++) {
            let r = p[i].split('=');
            matches[decodeURIComponent(r[0])] = decodeURIComponent(r.slice(1).join('='));
        }
    }
    const url = segmentize(rawUrl.replace(reg, ''));
    const route = segmentize(rawRoute || '');
    const max = Math.max(url.length, route.length);
    for (let i = 0; i < max; i++) {
        if (route[i] && route[i].charAt(0) === ':') {
            let param = route[i].replace(/(^:|[+*?]+$)/g, ''), flags = (route[i].match(/[+*?]+$/) || [])[0] || '', plus = ~flags.indexOf('+'), star = ~flags.indexOf('*'), val = url[i] || '';
            if (!val && !star && (flags.indexOf('?') < 0 || plus)) {
                ret = false;
                break;
            }
            matches[param] = decodeURIComponent(val);
            if (plus || star) {
                matches[param] = url.slice(i).map(decodeURIComponent).join('/');
                break;
            }
        }
        else if (route[i] !== url[i]) {
            ret = false;
            break;
        }
    }
    if (opts.default !== true && ret === false)
        return false;
    return matches;
}
export function pathRankSort(a, b) {
    return a.rank < b.rank ? 1 : a.rank > b.rank ? -1 : a.index - b.index;
}
export function prepareVNodeForRanking(vnode, index) {
    if (!vnode.props) {
        return false;
    }
    vnode.index = index;
    vnode.rank = rankChild(vnode);
    return true;
}
export function segmentize(url) {
    return url.replace(/(^\/+|\/+$)/g, '').split('/');
}
export function rankSegment(segment) {
    return segment.charAt(0) == ':'
        ? 1 + '*+?'.indexOf(segment.charAt(segment.length - 1)) || 4
        : 5;
}
export function rank(path) {
    return segmentize(path).map(rankSegment).join('');
}
function rankChild(vnode) {
    return vnode.props.default ? 0 : rank(vnode.props.path || '');
}
