/* 한국케이앤에스 automationkns.com — 새 디자인 공통 읽기 코드 (2026-10-23, 저장소 ESKIM92/kns-homepage-renewal mig/live_build/skin/loader.js)
   사이트 공통 Header Code 에서 불러온다(주소에 커밋 고정). 주소를 보고 세 가지 중 하나를 한다.
   ① 새 디자인 페이지(코드 위젯): 본문은 위젯 안에 있다(자리표시 방식은 10/23 15:xx 대표님 망에서 CDN 왕복이 느려 되돌림). 자리표시(data-kns-page)가 남아 있으면 pages/<이름>.html 에서 받아 붙인다. 본 뒤 상품 상세 틀 · 데이터를 미리 받아 둔다.
   ② 상품 상세(?idx=N, bmode 없음): skin/shell.html + skin/items.json(전 상품 묶음, 한 번 받아 캐시)으로 새 상품 상세 화면을 통째로 붙이고 아임웹 기본 화면은 숨긴다.
      데이터가 없는 상품(새로 등록 등)은 아임웹 기본 화면을 그대로 둔다.
   ③ 그 밖의 옛 페이지(게시판 · 옛 분류 · 회사소개 등): 새 머리 · 메뉴 · 바닥만 두르고 본문은 아임웹 그대로.
   English 페이지(/467 · /469 · /470)는 보류(대표님 2026-10-16) — 손대지 않는다. 디자인 모드(kns.uriweb.kr)에서는 동작하지 않는다. */
(function () {
  try {
    var H = location.hostname;
    if (H !== 'automationkns.com' && H !== 'www.automationkns.com') return;
    var S = document.currentScript && document.currentScript.src;
    var BASE = window.KNS_SKIN_BASE || (S ? S.replace(/skin\/loader\.js.*$/, '') : '');   // KNS_SKIN_BASE: 시험용 수동 지정
    if (!BASE) return;
    var NEW = ["/", "/101", "/128", "/146", "/15", "/155", "/16", "/164", "/165", "/166", "/167", "/173", "/174", "/175", "/181996915", "/210", "/217", "/339", "/641043139", "/69", "/80", "/82", "/83", "/95", "/971094399", "/applications", "/company", "/discontinued", "/explosion-proof", "/g-indicator", "/g-sensor", "/index", "/mts", "/mts-models", "/pdm", "/pdm-sensors", "/privacy", "/privacy-2020", "/products", "/search", "/substitute"];
    var EX = ["/467", "/469", "/470"];
    var FOOT = 's2026100778463f52bc3a3';   // 아임웹 공통 바닥 섹션(새 바닥으로 대체)
    var q = new URLSearchParams(location.search);
    var p = location.pathname.replace(/\/+$/, '') || '/';
    try { p = decodeURI(p); } catch (e) {}
    var idx = q.get('idx');
    var isNew = NEW.indexOf(p) >= 0 && !idx && !q.has('bmode');
    var isItem = !!idx && /^\d+$/.test(idx) && !q.has('bmode');
    var T0 = performance.now(), logged = false;
    function plog(tag) {  // 속도 진단 기록(이 브라우저의 localStorage 'kns-perf' 에 최근 40건, 서버로 보내지 않음)
      if (logged) return; logged = true;
      try {
        var nav = performance.getEntriesByType('navigation')[0] || {};
        var cdn = performance.getEntriesByType('resource').filter(function (r) { return r.name.indexOf('jsdelivr') >= 0 && /pages\/|shell|item\//.test(r.name); }).map(function (r) { return [r.name.split('/').slice(-1)[0].slice(0, 14), Math.round(r.duration), r.transferSize]; });
        var L = JSON.parse(localStorage.getItem('kns-perf') || '[]');
        L.push({ ts: new Date().toISOString().slice(5, 19), p: p + (idx ? '?idx=' + idx : ''), tag: tag, show: Math.round(performance.now()), ttfb: Math.round(nav.responseStart || 0), act: Math.round(nav.activationStart || 0), vis: document.visibilityState, pre: !!document.prerendering, cdn: cdn.slice(0, 4), ua: (navigator.userAgentData && navigator.userAgentData.mobile) ? 'm' : 'd' });
        localStorage.setItem('kns-perf', JSON.stringify(L.slice(-40)));
      } catch (e) {}
    }
    function release(tag) { var h = document.documentElement; h.className = h.className.replace(/\s*kns-pre/g, ''); plog(tag || 'rel'); }
    function ready(fn) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn(); }
    function frag(html) {
      var f = document.createRange().createContextualFragment(html);
      Array.prototype.slice.call(f.querySelectorAll('script')).forEach(function (o) {
        var n = document.createElement('script');
        for (var i = 0; i < o.attributes.length; i++) n.setAttribute(o.attributes[i].name, o.attributes[i].value);
        n.text = o.textContent; o.parentNode.replaceChild(n, o);
      });
      return f;
    }
    function get(u) { return fetch(u, { cache: 'force-cache' }).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status + ' ' + u); return r.text(); }); }
    var shellP = null;
    function shell() { return shellP || (shellP = get(BASE + 'skin/shell.html').then(function (t) { return t.split('__SKIN_BASE__').join(BASE); })); }
    function fail(e) { try { console.warn('kns-loader', e); } catch (x) {} release(); }

    // 마우스를 올린 링크를 미리 그려 둔다(크롬 · 엣지, 같은 사이트 주소만). 구글 태그는 실제 열릴 때 집계한다.
    try {
      if (HTMLScriptElement.supports && HTMLScriptElement.supports('speculationrules') && !document.querySelector('script[type="speculationrules"]')) {
        var sr = document.createElement('script'); sr.type = 'speculationrules';
        sr.text = JSON.stringify({ prerender: [{ where: { and: [{ href_matches: '/*' }, { not: { href_matches: '/admin/*' } }, { not: { href_matches: '/*\\?*bmode=*' } }] }, eagerness: 'moderate' }] });
        document.head.appendChild(sr);
      }
    } catch (e) {}
    if (EX.indexOf(p) >= 0) { release(); return; }

    function stubEl() {
      var L = document.querySelectorAll('[data-kns-page]');
      for (var i = 0; i < L.length; i++) { var sp = L[i].getAttribute('data-kns-path'); if (!sp || sp === p || (p === '/index' && sp === '/')) return L[i]; }
      return null;
    }
    var placed = false;
    function place(st, t) {
      if (placed || document.getElementById('kns-root')) { placed = true; release(); return; }
      placed = true; st.parentNode.insertBefore(frag(t), st); release('new');
    }
    function stub() {  // ① 자리표시 위젯(data-kns-page)이 있으면 본문을 받아 붙인다 → true (본문이 위젯 안에 있는 페이지는 false)
      var st = stubEl();
      if (!st) return false;
      if (document.getElementById('kns-root')) { release(); return true; }
      get(BASE + 'pages/' + st.getAttribute('data-kns-page') + '.html').then(function (t) { place(st, t); }).catch(fail);
      return true;
    }
    var itemsP = null;
    function items() { return itemsP || (itemsP = fetch(BASE + 'skin/items.json', { cache: 'force-cache' }).then(function (r) { if (!r.ok) throw new Error('items ' + r.status); return r.json(); })); }
    if (isNew) {   // 새 디자인 페이지 — 본문은 위젯 안(아임웹 HTML 한 번으로 끝, CDN 왕복 없음). 보고 난 뒤 상품 상세 틀 · 데이터를 미리 받아 둔다
      ready(function () {
        if (!stub()) release();
        setTimeout(function () { shell().catch(function () {}); items().catch(function () {}); }, 2500);
      });
      return;
    }

    if (isItem) {  // ② 상품 상세
      Promise.all([shell(), items()]).then(function (r) {
        var it = r[1][idx];
        if (!it) { release(); return; }   // 데이터 없는 상품 → 아임웹 기본 화면
        var D = {}; D[idx] = it;
        (it.r || []).forEach(function (k) { var s = r[1][k]; if (s) D[k] = { n: s.n, gt: s.gt }; });
        var data = JSON.stringify(D);
        (function () {
          ready(function () {
            if (document.getElementById('kns-root')) { release(); return; }
            var html = r[0].replace('<script id="kd" type="application/json">{}</script>', function () { return '<script id="kd" type="application/json">' + data.replace(/<\/(script)/gi, '<\\/$1') + '</script>'; });
            var missing = false;
            document.addEventListener('kns-item-missing', function () { missing = true; });
            document.body.appendChild(frag(html));
            if (missing) { var w = document.getElementById('kns-wrap'); if (w) w.parentNode.removeChild(w); }
            release('item');
          });
        })();
      }).catch(fail);
      return;
    }

    // ③ 옛 페이지에 새 머리 · 메뉴 · 바닥만
    shell().then(function (t) {
      ready(function () {
        if (stub()) return;
        if (document.getElementById('kns-root')) { release(); return; }
        var doc = new DOMParser().parseFromString(t, 'text/html');
        var wrap = doc.getElementById('kns-wrap'), root = doc.getElementById('kns-root');
        if (!wrap || !root) throw new Error('shell');
        var col = null;
        for (var i = 0; i < root.children.length; i++) if (root.children[i].tagName === 'DIV' && !root.children[i].id) { col = root.children[i]; break; }
        if (!col) throw new Error('col');
        var B = wrap.cloneNode(true);
        var main = col.querySelector(':scope > div.wrap'), foot = col.querySelector(':scope > footer');
        if (main) main.parentNode.removeChild(main);
        if (foot) foot.parentNode.removeChild(foot);
        // B: 바닥만
        var rootB = B.querySelector('#kns-root');
        Array.prototype.slice.call(rootB.children).forEach(function (c) { if (!(c.tagName === 'DIV' && !c.id)) rootB.removeChild(c); });
        var colB = rootB.firstElementChild;
        Array.prototype.slice.call(colB.children).forEach(function (c) { if (c.tagName !== 'FOOTER') colB.removeChild(c); });
        Array.prototype.slice.call(B.querySelectorAll('script')).forEach(function (s) { s.parentNode.removeChild(s); });
        colB.style.minHeight = '0';
        var ov = '<style id="kns-skin-css">body.kns-skin .section_wrap:not(#' + FOOT + '):not(#kns-wrap):not(#kns-root):not(#kns-skin-css){display:block!important}body.kns-skin #' + FOOT + '{display:none!important}body.kns-skin #kns-wrap:first-child{margin-bottom:24px}</style>';
        document.body.classList.add('kns-skin');
        var head = doc.head.innerHTML;
        document.body.insertBefore(frag(head + ov + wrap.outerHTML), document.body.firstChild);
        document.body.appendChild(frag(B.outerHTML));
        release('skin');
      });
    }).catch(fail);
  } catch (e) { try { console.warn('kns-loader', e); } catch (x) {} var h = document.documentElement; h.className = h.className.replace(/\s*kns-pre/g, ''); }
})();
