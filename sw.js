// 오프라인 지원: 게임 파일은 설치 시 캐시, 그림·글꼴(같은 사이트 fonts/)은 처음 받을 때 캐시
// v65 (v3.1.3): 첫 방문 뒤·업데이트 직후 오프라인에서도 글꼴·로고·아이콘이 보이게
//  - 설치 때 첫 화면 그림·글꼴(FIRST)도 같이 받음 (하나 못 받아도 설치는 계속)
//  - 페이지가 이미 받은 같은 사이트 파일 목록을 보내면(warm) 캐시에 없는 것만 받아 둠 (서비스워커가 붙기 전에 받은 파일 · 새 버전으로 캐시를 바꾼 직후)
// v77 (v3.6.3): 첫 판·다시 온 첫 화면에서 처음 쓰는 그림·글꼴 조각도 FIRST에 · 오프라인에서 게임이 아닌 페이지(가이드·안내)는 게임 대신 '인터넷 연결이 필요해요' 안내
const CACHE = 'sanghanga-v77';
const CORE = ['./', 'index.html', 'en/', 'en/index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];
const EN = new URL('en/', self.location).pathname;
const HOME = new URL('./', self.location).pathname;
const GAME = [HOME, HOME + 'index.html', EN, EN + 'index.html', EN.slice(0, -1)]; // 오프라인에서 캐시된 게임으로 대신 보여 줄 주소 (게임 페이지만)
// 캐시에 없는 다른 페이지(가이드·개인정보처리방침·운영자 소개 등)를 오프라인에서 열면: 게임 대신 이 짧은 안내 (글꼴·그림 없이 이 파일만으로 보임)
const OFFLINE = en => new Response('<!doctype html><html lang="' + (en ? 'en' : 'ko') + '"><head><meta charset="utf-8">' +
  '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="color-scheme" content="light dark"><meta name="robots" content="noindex">' +
  '<title>' + (en ? 'You’re offline' : '인터넷 연결이 필요해요') + '</title><style>:root{color-scheme:light dark;--bg:#ffffff;--fg:#1b1d21;--mu:#5d6472;--link:#0a62c2}' +
  '@media (prefers-color-scheme:dark){:root{--bg:#0e1014;--fg:#e8ebf0;--mu:#9ba3b1;--link:#74b6ff}}*{box-sizing:border-box}html{-webkit-text-size-adjust:100%;text-size-adjust:100%}' +
  'body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.7 -apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Malgun Gothic","Noto Sans KR","Segoe UI",Roboto,sans-serif;word-break:keep-all;overflow-wrap:anywhere}' +
  'main{max-width:680px;margin:0 auto;padding:calc(48px + env(safe-area-inset-top,0px)) max(16px,env(safe-area-inset-right,0px)) calc(40px + env(safe-area-inset-bottom,0px)) max(16px,env(safe-area-inset-left,0px))}' +
  'h1{font-size:24px;line-height:1.35;margin:0 0 8px}p{margin:8px 0;color:var(--mu)}a{display:inline-block;padding:8px 0;color:var(--link);font-weight:600}</style></head><body><main>' +
  (en ? '<h1>You’re offline</h1><p>This page needs an internet connection the first time. Please try again once you’re online.</p><p><a href="' + EN + '">← Back to the game</a></p>'
    : '<h1>인터넷 연결이 필요해요</h1><p>이 페이지는 처음 열 때 인터넷이 필요해요. 연결된 뒤 다시 열어 주세요.</p><p><a href="' + HOME + '">← 게임으로 돌아가기</a></p>') +
  '</main></body></html>', { status: 503, headers: { 'content-type': 'text/html; charset=utf-8' } });
const FIRST = ['fonts/fonts.css', 'fonts/inter.latin.woff2', 'fonts/noto.latin.woff2', 'fonts/gasoek.latin.woff2',
  'brand/title_ko.webp', 'brand/title_en.webp', 'brand/intro_portrait_ko.webp', 'brand/intro_portrait_v3.webp',
  // v77: 첫 화면을 연 뒤에 처음 쓰는 파일 (새 파트너 아기 그림 12종은 합류 순서가 판마다 달라 전부) (▶ 바로 시작 · 첫 판 · 다시 연 첫 화면, 그때그때 다른 글자 조각 포함) · Playwright로 잰 첫 세션 요청 중 캐시에 없던 것만
  'chars/squirrel_baby.webp', 'chars/bull_baby.webp', 'chars/hamster_baby.webp', 'chars/bear_baby.webp', 'chars/cat_baby.webp', 'chars/corgi_baby.webp', 'chars/dragon_baby.webp',
  'chars/fox_baby.webp', 'chars/lion_baby.webp', 'chars/panda_baby.webp', 'chars/penguin_baby.webp', 'chars/turtle_baby.webp', 'fonts/noto.104.woff2', 'fonts/gasoek.108.woff2', 'fonts/noto.11.woff2', 'fonts/noto.102.woff2', 'fonts/noto.106.woff2', 'fonts/noto.107.woff2', 'fonts/noto.110.woff2', 'fonts/noto.111.woff2',
  'fonts/gasoek.112.woff2', 'fonts/gasoek.114.woff2', 'fonts/gasoek.115.woff2', 'fonts/gasoek.116.woff2', 'fonts/gasoek.117.woff2', 'fonts/gasoek.118.woff2', 'fonts/gasoek.119.woff2'].concat(
  ('chart_up clipboard skill_tree briefcase shopping_cart bar_chart gear_cog gift sprout level_up newspaper fire robot smartphone personality_quiz ' +
  'type_fox type_lion type_squirrel type_turtle classical_building frog_coin dna penny_coin globe_dollar shield magnifier stopwatch lightning hundred keyboard lock star ' +
  'thumbs_up explosion hourglass party_popper warning share money_bag trophy house watch_ad rocket money_wings credit_card restart cash lightbulb potion receipt zzz rank_insignia skull check_badge point_down repeat new_badge books office_building treasure_chest theater_masks chart_down raised_paws sparkles toilet_paper paw_wave hatching_chick unlock season_ticket ant sweat')
  .split(' ').map(id => 'ui/' + id + '.webp'));

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE).then(() => Promise.all(FIRST.map(u => c.add(u).catch(() => {}))))).then(() => self.skipWaiting()));
});
// 페이지가 보낸 목록(같은 사이트 주소만, 최대 400개) 중 캐시에 없는 것만 받아 둠 · 하나 못 받아도 계속
// v77: full = 앱(설치)에서만 · offline-assets.json(그림·글꼴 전부)도 캐시에 없는 것만 6개씩 나눠 받음 (끊기면 다음 실행 때 남은 것만 이어서)
const FULL = 'offline-assets.json';
let filling = null; // 이미 받는 중이면 같은 작업을 기다림 (첫 실행에 메시지가 두 번 와도 한 번만)
const fill = (c, l) => { let i = 0; const one = () => { if (i >= l.length) return null; const u = l[i++]; return c.match(u).then(h => h || c.add(u).catch(() => {})).then(one); };
  return Promise.all([1, 2, 3, 4, 5, 6].map(one)); };
self.addEventListener('message', e => {
  const l = e.data && e.data.warm;
  if (!Array.isArray(l)) return;
  const o = self.location.origin + '/';
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(l.slice(0, 400).filter(u => typeof u === 'string' && u.startsWith(o))
    .map(u => c.match(u).then(h => h || c.add(u).catch(() => {}))))
    .then(() => e.data.full === true && (filling = filling || fetch(FULL, { cache: 'no-cache' }).then(r => r.ok ? r.json() : [])
      .then(a => fill(c, (Array.isArray(a) ? a : []).filter(u => typeof u === 'string' && /^(brand|chars|ui|fonts)\/[\w.-]+$/.test(u)).slice(0, 2000)))
      .catch(() => {}).then(() => { filling = null; })))));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  // 페이지: 온라인이면 최신 버전, 오프라인이면 캐시 (영어 페이지는 영어 캐시로만, 언어를 넘어 대신 보여 주지 않음)
  //  캐시에 없으면: 게임 주소(/ · /index.html · /en/ · /en/index.html)만 캐시된 게임으로, 다른 페이지는 오프라인 안내 (게임을 엉뚱한 주소에서 띄우지 않음)
  if (e.request.mode === 'navigate') {
    const en = (url.pathname + '/').startsWith(EN), game = GAME.includes(url.pathname);
    e.respondWith(fetch(e.request)
      .then(r => { if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request.url.split('?')[0], copy)); } return r; })
      .catch(() => caches.match(e.request.url.split('?')[0]).then(h => h || (game && caches.match(en ? 'en/' : './'))).then(h => h || OFFLINE(en))));
    return;
  }
  // 나머지(그림, 글꼴): 캐시 우선
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(r => {
    if (r.ok || r.type === 'opaque') {
      if (url.origin === location.origin) {
        const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy));
      }
    }
    return r;
  })));
});
