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
    // 받은 묶음은 window.KNS_ITEMS 에 두고 kns:items 를 알린다 — 견적 바구니가 사진 없는 항목(사진 저장 전에 담은 것)의 대표 사진을 여기서 채운다(sub.js fillImgs)
    function items() { return itemsP || (itemsP = fetch(BASE + 'skin/items.json', { cache: 'force-cache' }).then(function (r) { if (!r.ok) throw new Error('items ' + r.status); return r.json(); }).then(function (j) { window.KNS_ITEMS = j; try { document.dispatchEvent(new CustomEvent('kns:items')); } catch (e) {} return j; })); }
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

/* kns-conv — 묶음 C 전환 신호(2026-10-26, 대표님 10:29 "진행해"). 운영 도메인에서만.
   GA4(G-PN5DES9FT7, GTM-MKGNT73 이 싣는 구글 태그)로 이벤트를 보낸다:
     generate_lead  — /16 문의 저장 성공(kns-inquiry-sent, 저장이 실제로 된 뒤에만 발생)
     chat_start     — 채널톡 상담 생성(ChannelIO onChatCreated, 페이지당 1회)
     contact_phone  — tel: 링크 클릭 / contact_email — mailto: 클릭 / contact_kakao — 카카오톡 링크 클릭
     doc_lead       — 자료 내려받기 전 정보 입력(kns-lead, 고객당 처음 1회)
   Google Ads 전환은 window.KNS_CONV 의 send_to('AW-10866308738/라벨')가 채워진 항목만 보낸다(라벨은 계정에서 전환 항목을 만든 뒤 넣음 — 비어 있으면 GA4 만). */
(function () {
  try {
    if (window.__knsConv) return; window.__knsConv = 1;
    if (!/(^|\.)automationkns\.com$/.test(location.hostname)) return;
    var C = window.KNS_CONV || { lead: '', chat: '', phone: '', email: '', kakao: '' };
    function gt() { window.dataLayer = window.dataLayer || []; if (typeof window.gtag !== 'function') window.gtag = function () { window.dataLayer.push(arguments); }; return window.gtag; }
    var once = {};
    function fire(k, ev, p, one) {
      if (one) { if (once[k]) return; once[k] = 1; }
      try {
        p = p || {}; p.send_to = 'G-PN5DES9FT7'; p.page_path = location.pathname;
        var g = gt(); g('event', ev, p);
        if (C[k]) g('event', 'conversion', { send_to: C[k] });
      } catch (e) { try { console.warn('kns-conv', e); } catch (x) {} }
    }
    document.addEventListener('kns-inquiry-sent', function () { fire('lead', 'generate_lead', { form_name: 'inquiry_16' }); });
    document.addEventListener('kns-lead', function () { fire('doc', 'doc_lead', {}, true); });
    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest && e.target.closest('a[href]'); if (!a) return;
      var h = a.getAttribute('href') || '';
      if (/^tel:/i.test(h)) fire('phone', 'contact_phone', { link_url: h.slice(0, 40) });
      else if (/^mailto:/i.test(h)) fire('email', 'contact_email', { link_url: h.slice(0, 60) });
      else if (/(open|pf)\.kakao\.com/i.test(h)) fire('kakao', 'contact_kakao', { link_url: h.slice(0, 80) });
    }, true);
    // 채널톡 콜백은 부팅(아임웹 channel_plugin.js 의 boot) 뒤에 걸어야 유지된다(10/26 시험: 부팅 전 등록은 상담 생성 때 호출되지 않음).
    // → 부팅 전에 한 번, 플러그인 화면(#ch-plugin-script-iframe)이 생긴 뒤 한 번 더 건다(같은 종류 콜백은 덮어써짐).
    function reg() { try { window.ChannelIO('onChatCreated', function () { fire('chat', 'chat_start', { method: 'channeltalk' }, true); }); } catch (e) {} }
    (function ch(n, pre) {
      var ok = typeof window.ChannelIO === 'function';
      if (ok && !pre) { reg(); pre = 1; }
      if (ok && document.getElementById('ch-plugin-script-iframe')) { setTimeout(reg, 300); return; }
      if (n < 120) setTimeout(function () { ch(n + 1, pre); }, 500);
    })(0, 0);
  } catch (e) { try { console.warn('kns-conv', e); } catch (x) {} }
})();

/* kns-src — 문의 유입 경로 자동 기록(2026-10-28, 대표님 13:26 승인). 운영 도메인에서만.
   첫 방문 때 주소의 gclid·gbraid·wbraid 또는 utm_medium=cpc → '구글 광고', 그 외 utm → '캠페인(…)',
   없으면 직전 사이트(referrer)로 구글 검색 / 네이버 / 기타 검색 / 다른 사이트(주소) / 직접 접속 판정.
   브라우저 저장소 kns_src_v1 에 최대 90일 보관(첫 방문 페이지 · 일시 포함), window.KNS_SRC 로 공개.
   ① /16 접수: /ajax/form_add.cm 전송을 가로채 '[홈페이지 문의]'로 시작하는 문의 내용 칸 끝에
      "[유입: … / 첫 페이지 … / 일시 …]" 한 줄 추가(이미 있으면 추가 안 함 — 이중 기록 방지)
   ② 채널톡: 부팅 뒤 updateUser 로 프로필에 유입경로 · 첫페이지 · 첫방문 기록 */
(function () {
  try {
    if (window.__knsSrc) return; window.__knsSrc = 1;
    if (!/(^|\.)automationkns\.com$/.test(location.hostname)) return;
    var K = 'kns_src_v1', NOW = Date.now(), rec = null;
    try { rec = JSON.parse(localStorage.getItem(K) || 'null'); } catch (e) {}
    if (rec && (!rec.t || NOW - rec.t > 90 * 864e5)) rec = null;
    if (!rec) {
      var q = null; try { q = new URLSearchParams(location.search); } catch (e) {}
      var gv = function (k) { return (q && q.get(k)) || ''; };
      var g = gv('gclid') || gv('gbraid') || gv('wbraid');
      var um = gv('utm_medium').toLowerCase(), us = gv('utm_source');
      var refh = ''; try { refh = document.referrer ? new URL(document.referrer).hostname : ''; } catch (e) {}
      var label;
      if (g || um === 'cpc' || um === 'ppc') label = '구글 광고';
      else if (us) label = '캠페인(' + us.slice(0, 20) + (um ? '/' + um.slice(0, 10) : '') + ')';
      else if (!refh || /(^|\.)automationkns\.com$/.test(refh)) label = '직접 접속';
      else if (/(^|\.)google\./.test(refh)) label = '구글 검색';
      else if (/naver\.com$/.test(refh)) label = '네이버';
      else if (/(^|\.)(bing\.com|duckduckgo\.com|daum\.net|search\.yahoo\.com|yandex\.com)$/.test(refh)) label = '기타 검색(' + refh + ')';
      else label = '다른 사이트(' + refh.slice(0, 40) + ')';
      var d = new Date(NOW + 9 * 3600e3);
      rec = { t: NOW, label: label, pg: (location.pathname.replace(/\/+$/, '') || '/').slice(0, 60), at: d.toISOString().slice(0, 16).replace('T', ' '), g: String(g).slice(0, 20) };
      try { localStorage.setItem(K, JSON.stringify(rec)); } catch (e) {}
    }
    window.KNS_SRC = rec;
    var line = '[유입: ' + rec.label + ' / 첫 페이지 ' + rec.pg + ' / ' + rec.at + (rec.g ? ' / gclid ' + rec.g : '') + ']';
    var OF = window.fetch;
    window.fetch = function (u, o) {
      try {
        if (typeof u === 'string' && u.indexOf('/ajax/form_add.cm') >= 0 && o && typeof o.body === 'string') {
          var b = new URLSearchParams(o.body), hit = '';
          b.forEach(function (v, k) { if (!hit && v.indexOf('[홈페이지 문의]') === 0 && v.indexOf('[유입:') < 0) hit = k; });
          if (hit) { b.set(hit, b.get(hit) + '\n\n' + line); o.body = b.toString(); }
        }
      } catch (e) { try { console.warn('kns-src', e); } catch (x) {} }
      return OF.apply(this, arguments);
    };
    (function chUp(n) {
      if (typeof window.ChannelIO !== 'function') { if (n < 90) setTimeout(function () { chUp(n + 1); }, 1000); return; }
      try {
        window.ChannelIO('updateUser', { profile: { '유입경로': rec.label, '첫페이지': rec.pg, '첫방문': rec.at } }, function (err) {
          if (err && n < 90) setTimeout(function () { chUp(n + 10); }, 5000);
        });
      } catch (e) {}
    })(0);
  } catch (e) { try { console.warn('kns-src', e); } catch (x) {} }
})();
