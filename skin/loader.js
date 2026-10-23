/* 한국케이앤에스 automationkns.com — 새 디자인 공통 읽기 코드 (2026-10-23, 저장소 ESKIM92/kns-homepage-renewal mig/live_build/skin/loader.js)
   사이트 공통 Header Code 에서 불러온다(주소에 커밋 고정). 주소를 보고 세 가지 중 하나를 한다.
   ① 새 디자인 페이지(코드 위젯): 본문은 위젯 안에 있다(자리표시 방식은 10/23 15:xx 대표님 망에서 CDN 왕복이 느려 되돌림). 자리표시(data-kns-page)가 남아 있으면 pages/<이름>.html 에서 받아 붙인다. 본 뒤 상품 상세 틀 · 데이터를 미리 받아 둔다.
   ② 상품 상세(?idx=N, bmode 없음): skin/shell.html + skin/items.json(전 상품 묶음, 한 번 받아 캐시)으로 새 상품 상세 화면을 통째로 붙이고 아임웹 기본 화면은 숨긴다.
      데이터가 없는 상품(새로 등록 등)은 아임웹 기본 화면을 그대로 둔다.
   ③ 그 밖의 옛 페이지(옛 분류 · 회사소개 등): 새 머리 · 메뉴 · 바닥만 두르고 본문은 아임웹 그대로.
   ④ 게시판 /58 · /59 · /60 · /61 · /62(목록 · 글 보기): 아임웹 화면을 읽어 skin/board.html(새 디자인)로 다시 그림. 못 읽으면 ③.
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
    function skinWrap() { shell().then(function (t) {
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
    }).catch(fail); }

    // ④ 게시판(공지사항 58 · 자료실 59 · CAD 60 · 소프트웨어 61 · 뉴스레터 62) — 아임웹 화면을 읽어 새 디자인으로 다시 그림
    var bm = p.match(/^\/(58|59|60|61|62)$/);
    function txt(e) { return e ? (e.textContent || '').replace(/\s+/g, ' ').trim() : ''; }
    function parseBoard(doc, b) {
      var sec = null, S = doc.querySelectorAll('.section_wrap');
      for (var i = 0; i < S.length; i++) if (!S[i].querySelector('#kns-root') && S[i].querySelector('ul.li_body, .view_tit, .board_txt_area')) { sec = S[i]; break; }
      if (!sec) return null;
      var isView = q.get('bmode') === 'view' || !!sec.querySelector('.view_tit');
      var out = { b: b, mode: isView ? 'view' : 'list' };
      if (isView) {
        var h = sec.querySelector('.view_tit'); if (!h) return null;
        var hc = h.cloneNode(true), ce = hc.querySelector('.category'), cat = '', catHref = '';
        if (ce) { cat = txt(ce); var ca = ce.closest('a'); catHref = ca ? ca.getAttribute('href') : ''; (ca || ce).parentNode.removeChild(ca || ce); }
        var V = { title: txt(hc), cat: cat, catHref: catHref, files: [], listHref: '/' + b };
        var body = sec.querySelector('.board_txt_area');
        if (body) { var bc = body.cloneNode(true); Array.prototype.slice.call(bc.querySelectorAll('.file_area')).forEach(function (x) { x.parentNode.removeChild(x); }); V.body = bc.innerHTML; }
        Array.prototype.slice.call(sec.querySelectorAll('.file_area a')).forEach(function (a) {
          var href = a.getAttribute('data-kdl') || a.getAttribute('href') || ''; if (!href || href === '#kdl' || href === '#') return;
          var n = txt(a), m = n.match(/^(.*?)\s*(\d[\d.,]*\s*[KMG]?B)$/i);
          V.files.push({ n: m ? m[1] : n, size: m ? m[2] : '', href: href });
        });
        var st = txt(sec); var md = st.match(/(\d{4})[.\-\/](\d{2})[.\-\/](\d{2})/); if (md) V.date = md[1] + '-' + md[2] + '-' + md[3];
        var mr = st.match(/조회\s*수?\s*:?\s*([\d,]+)/); if (mr) V.read = mr[1];
        var cur = q.get('idx'), nav = [];
        Array.prototype.slice.call(sec.querySelectorAll('a[href*="bmode=view"]')).forEach(function (a) {
          var hh = a.getAttribute('href') || ''; var mi = hh.match(/idx=(\d+)/); if (!mi || mi[1] === cur) return; var t = txt(a); if (!t) return;
          var box = a.closest('li,tr,div'), bt = box ? txt(box) : '';
          nav.push({ t: t.replace(/^(이전\s*글|다음\s*글)\s*/, ''), href: hh, k: /이전/.test(bt) ? 'prev' : /다음/.test(bt) ? 'next' : '' });
        });
        nav.forEach(function (x, i) { var k = x.k || (i === 0 ? 'prev' : 'next'); if (!V[k]) V[k] = { t: x.t, href: x.href }; });
        if (!body && /로그인|회원/.test(st)) V.locked = true;
        out.view = V;
      } else {
        var L = { rows: [], pages: [], cats: [], q: q.get('keyword') || '', cat: q.get('category') || '' }, total = 0;
        Array.prototype.slice.call(sec.querySelectorAll('ul.li_body')).forEach(function (r) {
          var a = r.querySelector('li.tit a.list_text_title') || r.querySelector('li.tit a'); if (!a) return;
          var ca = r.querySelector('li.category a'), no = txt(r.querySelector('li.count')); var n = parseInt(no.replace(/\D/g, ''), 10); if (n > total) total = n;
          L.rows.push({ no: no, nt: /notice/.test(r.className), cat: txt(r.querySelector('li.category')), catHref: ca ? ca.getAttribute('href') : '', title: txt(a), href: /^javascript/.test(a.getAttribute('href') || '') ? '' : (a.getAttribute('href') || ''),
            date: txt(r.querySelector('li.time')), read: (txt(r.querySelector('li.read')).match(/[\d,]+/) || [''])[0], lock: /^javascript/.test(a.getAttribute('href') || '') /* 회원 전용(CAD · 소프트웨어): 아임웹이 로그인 창을 띄우는 글 — 자물쇠 아이콘 자체는 모든 글에 붙어 있어 쓰지 않는다 */, file: !!r.querySelector('.bt-file, .icon-attach, .icon-paperclip, [class*="attach"]') });
        });
        Array.prototype.slice.call(sec.querySelectorAll('ul.pagination li')).forEach(function (li) { var a = li.querySelector('a'); var ph = a ? (a.getAttribute('href') || '') : ''; if (/^javascript/.test(ph)) ph = ''; L.pages.push({ t: txt(li), href: ph, on: /active/.test(li.className), cls: /disabled/.test(li.className) ? 'dis' : '' }); });
        var seen = {};
        Array.prototype.slice.call(sec.querySelectorAll('ul.dropdown-menu li[class*="_category_"]')).forEach(function (li) { var mc = (li.className.match(/_category_(\w+)/) || [])[1]; if (!mc || mc === 'all' || seen[mc]) return; seen[mc] = 1; var n = txt(li); if (!n) return; L.cats.push({ n: n, href: '/' + b + '/?category=' + mc, on: L.cat === mc }); });   // 아임웹 분류 선택 메뉴(전체 분류)
        Array.prototype.slice.call(sec.querySelectorAll('a[href*="category="]')).forEach(function (a) { var hh = a.getAttribute('href') || '', mc = hh.match(/category=([^&]+)/); if (!mc || seen[mc[1]]) return; seen[mc[1]] = 1; var n = txt(a); if (!n) return; L.cats.push({ n: n, href: '/' + b + '/?category=' + mc[1], on: L.cat === mc[1] }); });
        L.total = total || L.rows.filter(function (r) { return !r.nt; }).length;
        L.lockNote = L.rows.some(function (r) { return r.lock; });
        if (!L.rows.length && !/게시물이 없습니다|검색 결과|등록된/.test(txt(sec))) return null;
        out.list = L;
      }
      return out;
    }
    if (bm) {
      get(BASE + 'skin/board.html').then(function (t) { return t.split('__SKIN_BASE__').join(BASE); }).then(function (t) {
        ready(function () {
          if (document.getElementById('kns-root')) { release(); return; }
          var data = null; try { data = parseBoard(document, bm[1]); } catch (e) { try { console.warn('kns-board', e); } catch (x) {} }
          if (!data) { skinWrap(); return; }   // 못 읽으면 머리 · 바닥만 두르고 아임웹 본문 그대로
          window.KNS_BOARD = data;
          document.body.appendChild(frag(t));
          release('board');
        });
      }).catch(function (e) { try { console.warn('kns-board', e); } catch (x) {} skinWrap(); });
      return;
    }

    skinWrap();
  } catch (e) { try { console.warn('kns-loader', e); } catch (x) {} var h = document.documentElement; h.className = h.className.replace(/\s*kns-pre/g, ''); }
})();
