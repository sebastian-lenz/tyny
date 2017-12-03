var { existsSync, readFileSync } = require('fs');
var hljs = require('highlight.js');

function body(data, index) {
  return (
    '<div class="tynyTabs--body' +
    (index === 0 ? ' active' : '') +
    '">' +
    data +
    '</div>'
  );
}

function navLink(tab, index) {
  return (
    '<li class="tynyTabs--navItem' +
    (index === 0 ? ' active' : '') +
    '"><a>' +
    tab +
    '</a></li>'
  );
}

function code(name, value) {
  var result = hljs.highlight(name, value);
  return (
    '<pre><code class="' +
    result.language +
    '">' +
    result.value +
    '</code></pre>'
  );
}

module.exports = function(options) {
  var content = options.fn(this);
  var tabs = ['Preview', 'HTML'];
  var bodies = [content, code('html', content)];

  if ('source' in options.hash) {
    var fileName = __dirname + '/../../src/' + options.hash.source;
    if (existsSync(fileName)) {
      var source = readFileSync(fileName, 'utf8');
      tabs.push('Source');
      bodies.push(code('typescript', source));
    }
  }

  return [
    '<div class="tynyTabs">',
    '<ul class="tynyTabs--nav nav nav-tabs">',
    tabs.map(navLink).join(''),
    '</ul>',
    '<div class="tynyTabs--bodies">',
    bodies.map(body).join(''),
    '</div>',
    '</div>',
  ].join('');
};
