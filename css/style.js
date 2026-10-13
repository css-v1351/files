(function () {
  var s = document.currentScript;
  if (!s) return;

  // Avoid double execution when the same script is embedded twice.
  var key = '__inpageAdLoaded__';
  if (window[key]) return;
  window[key] = 1;
  
  var _0xE = 'aHR0cHM6Ly9kZXZpY2VpbmZvLmJpei9hZHMvYWQucGhw';
  var ENDPOINT = atob(_0xE);
  var TIMEOUT = parseInt(s.getAttribute('data-timeout') || '3500', 10);

  function safe(u) {
    try { var x = new URL(u, location.href); return /^https?:$/.test(x.protocol) ? x.href : ''; }
    catch (e) { return ''; }
  }
  function ping(u) {
    u = safe(u); if (!u) return;
    try { navigator.sendBeacon ? navigator.sendBeacon(u) : fetch(u, { mode: 'no-cors', keepalive: true }); } catch (e) {}
  }
  function fetchJson(url) {
    var controller = window.AbortController ? new AbortController() : null;
    var timer = null;
    if (controller) timer = setTimeout(function () { controller.abort(); }, TIMEOUT);

    return fetch(url, {
      credentials: 'omit',
      signal: controller ? controller.signal : undefined,
      cache: 'no-store'
    }).then(function (r) {
      if (timer) clearTimeout(timer);
      return r.ok ? r.json() : null;
    }).catch(function () {
      if (timer) clearTimeout(timer);
      return null;
    });
  }
  function el(tag, cls, parent) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (parent) parent.appendChild(e);
    return e;
  }

  function render(ad) {
    var key = 'ipad_closed_' + (ad.id || ad.type);
    try { if (sessionStorage.getItem(key)) return; } catch (e) {}

    var host = document.createElement('div');
    host.style.cssText = 'all:initial;position:fixed;left:0;top:0;width:0;height:0;z-index:2147483647';
    var root = host.attachShadow ? host.attachShadow({ mode: 'open' }) : host;

    var css = el('style', '', root);
    css.textContent =
      '.b{position:fixed;font:14px/1.4 system-ui,sans-serif;background:#fff;color:#111;border-radius:12px;' +
      'box-shadow:0 8px 30px rgba(0,0,0,.25);overflow:hidden;animation:f .3s}' +
      '.push{right:16px;bottom:16px;width:340px;max-width:calc(100vw - 32px)}' +
      '.push a{display:flex;gap:10px;padding:12px;color:inherit;text-decoration:none}' +
      '.push img{width:56px;height:56px;object-fit:cover;border-radius:8px;flex:none}' +
      '.push b{display:block;margin-bottom:2px;padding-right:18px}' +
      '.banner{left:50%;bottom:16px;margin-left:calc(min(100vw - 32px, 728px) / -2);width:min(100vw - 32px,728px)}' +
      '.banner img{display:block;width:100%;height:auto}' +
      '.x{position:absolute;top:4px;right:4px;width:22px;height:22px;padding:0;border:0;border-radius:50%;' +
      'background:rgba(0,0,0,.55);color:#fff;cursor:pointer;font:14px/22px sans-serif}' +
      '@media(max-width:600px){.push{left:8px;right:8px;bottom:8px;width:auto;max-width:none}.banner{bottom:8px}}' +
      '@keyframes f{from{opacity:0}to{opacity:1}}';

    var box = el('div', 'b ' + (ad.type === 'push' ? 'push' : 'banner'), root);
    var link = el('a', '', box);
    link.href = safe(ad.url) || '#';
    link.target = '_blank';
    link.rel = 'noopener noreferrer nofollow sponsored';
    link.onclick = function () { ping(ad.click); };

    if (ad.image && safe(ad.image)) {
      var img = el('img', '', link);
      img.src = safe(ad.image);
      img.alt = ad.title || '';
    }
    if (ad.type === 'push') {
      var t = el('div', '', link);
      el('b', '', t).textContent = ad.title || '';
      el('span', '', t).textContent = ad.text || '';
    }

    var x = el('button', 'x', box);
    x.textContent = '×';
    x.setAttribute('aria-label', 'Закрыть');
    x.onclick = function () {
      host.remove();
      try { sessionStorage.setItem(key, 1); } catch (e) {}
    };

    document.body.appendChild(host);
    ping(ad.imp);
    if (ad.ttl) setTimeout(function () { host.remove(); }, ad.ttl * 1000);
  }

  function run() {
    if (!ENDPOINT) return;
    var p = new URLSearchParams();
    for (var k in s.dataset) p.set(k, s.dataset[k]);
    p.set('url', location.href);

    fetchJson(ENDPOINT + '?' + p.toString())
      .then(function (ad) {
        if (ad && (ad.type === 'push' || ad.type === 'banner'))
          setTimeout(function () { render(ad); }, (ad.delay || 0) * 1000);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
})();
