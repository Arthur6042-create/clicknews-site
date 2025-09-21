
import React, { useEffect, useState } from 'react';

// ClickNews Brasil - Single-file React template (Tailwind CSS)
// - Default export: NewsApp component
// - Designed to be previewed in a single file for quick prototyping
// - Uses Tailwind utility classes (assumes Tailwind is configured in project)
// - Includes: fixed header, carousel, real-time feed (mock), category grids, sidebar, article page, footer
// - Dark mode, search with suggestions, comments placeholder, related articles, SEO meta (React Helmet commented)

export default function NewsApp() {
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem('cnb:dark') === 'true'; } catch { return false; }
  });
  const [query, setQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [activeArticle, setActiveArticle] = useState(null);
  const [topHeadlines, setTopHeadlines] = useState(mockHeadlines());
  const [feed, setFeed] = useState(mockFeed());
  const [category, setCategory] = useState('Últimas Notícias');

  useEffect(() => { document.documentElement.classList.toggle('dark', dark); localStorage.setItem('cnb:dark', dark); }, [dark]);

  useEffect(() => {
    // Simulate real-time feed updates (replace with SSE / WebSocket in prod)
    const id = setInterval(() => {
      setFeed(prev => [mockFeedItem(), ...prev].slice(0, 30));
    }, 15000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!query) return setSearchSuggestions([]);
    // Mock suggestion: filter headline titles
    const s = [...topHeadlines, ...feed].map(i => i.title).filter(t => t.toLowerCase().includes(query.toLowerCase())).slice(0,6);
    setSearchSuggestions(s);
  }, [query, topHeadlines, feed]);

  return (
    <div className={`min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors`}> 
      {/* SEO (use react-helmet or similar in production) */}
      {/* <Helmet>
        <title>ClickNews Brasil - Últimas notícias e análises</title>
        <meta name="description" content="Notícias atualizadas em tempo real, análises, opinião e muito mais." />
      </Helmet> */}

      <Header dark={dark} setDark={setDark} query={query} setQuery={setQuery} searchSuggestions={searchSuggestions} onSelect={t => setQuery(t)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <HeroCarousel items={topHeadlines} onOpen={setActiveArticle} />

            <div className="my-6">
              <h2 className="text-xl font-semibold mb-3">Últimas Notícias</h2>
              <FeedList items={feed} onOpen={setActiveArticle} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Política','Esportes','Tecnologia'].map(cat => (
                <CategoryCard key={cat} title={cat} items={mockCategoryItems(cat)} onOpen={setActiveArticle} />
              ))}
            </div>

          </div>

          <aside className="lg:col-span-1 space-y-6">
            <SidebarTop items={mockSidebarQuick()} />
            <WeatherWidget city="Salvador, BR" />
            <CurrencyWidget />
            <PopularWidget items={mockPopular()} onOpen={setActiveArticle} />
          </aside>
        </section>

        <section className="mt-10">
          <h3 className="text-lg font-semibold mb-4">Mais recentes</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {feed.slice(0,9).map(i => (
              <ArticleCard key={i.id} item={i} onOpen={setActiveArticle} />
            ))}
          </div>
        </section>

        {/* Article modal / page */}
        {activeArticle && (
          <ArticleModal item={activeArticle} onClose={() => setActiveArticle(null)} related={mockRelated(activeArticle)} />
        )}

      </main>

      <Footer />
    </div>
  );
}

// ---------- Header ----------
function Header({ dark, setDark, query, setQuery, searchSuggestions, onSelect }){
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <a className="flex items-center gap-3" href="#">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-orange-400 rounded-md flex items-center justify-center text-white font-bold">CN</div>
              <div className="hidden sm:block">
                <div className="font-bold">ClickNews Brasil</div>
                <div className="text-xs text-gray-500 dark:text-gray-300">Notícias em tempo real</div>
              </div>
            </a>

            <nav className="hidden md:flex items-center space-x-2 text-sm">
              {['Início','Últimas Notícias','Política','Economia','Esportes','Entretenimento','Tecnologia','Mundo','Opinião','Contato'].map(i=> (
                <a key={i} href="#" className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">{i}</a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar notícias, pessoas, temas..." className="w-56 md:w-80 rounded-lg border px-3 py-2 text-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              {searchSuggestions.length>0 && (
                <ul className="absolute right-0 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-sm text-sm overflow-hidden">
                  {searchSuggestions.map(s=> (
                    <li key={s} className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer" onClick={()=>onSelect(s)}>{s}</li>
                  ))}
                </ul>
              )}
            </div>

            <button onClick={() => setDark(!dark)} aria-label="Toggle dark mode" className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
              {dark ? '☀️' : '🌙'}
            </button>

            <a href="#newsletter" className="hidden sm:inline-block text-sm px-3 py-2 rounded bg-blue-600 text-white">Assinar</a>

            <button className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">☰</button>
          </div>
        </div>
      </div>
    </header>
  );
}

// ---------- Hero / Carousel ----------
function HeroCarousel({ items, onOpen }){
  const [idx, setIdx] = useState(0);
  useEffect(()=>{ const t = setInterval(()=> setIdx(i=> (i+1)%items.length), 6000); return ()=>clearInterval(t); }, [items.length]);
  if(!items.length) return null;
  const cur = items[idx];
  return (
    <div className="relative rounded-lg overflow-hidden shadow-lg">
      <img src={cur.image} alt={cur.title} className="w-full h-64 sm:h-96 object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
        <div>
          <div className="text-sm text-white uppercase tracking-wider">{cur.category}</div>
          <h1 className="text-2xl sm:text-4xl font-bold text-white leading-tight cursor-pointer" onClick={()=> onOpen(cur)}>{cur.title}</h1>
          <p className="text-sm text-gray-200 mt-2 hidden sm:block">{cur.subtitle}</p>
        </div>
      </div>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex space-x-2">
        {items.map((_,i)=> (
          <button key={i} onClick={()=>setIdx(i)} className={`w-3 h-3 rounded-full ${i===idx? 'bg-white':'bg-white/40'}`}></button>
        ))}
      </div>
    </div>
  );
}

// ---------- Feed ----------
function FeedList({ items, onOpen }){
  return (
    <div className="space-y-4">
      {items.map(i=> (
        <article key={i.id} className="p-4 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition" onClick={()=>onOpen(i)}>
          <div className="flex gap-4">
            <img src={i.image} alt="" className="w-28 h-20 object-cover rounded" />
            <div>
              <h4 className="font-semibold">{i.title}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">{i.author} • {i.published}</p>
              <p className="mt-2 text-sm line-clamp-2">{i.excerpt}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function CategoryCard({ title, items, onOpen }){
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
      <h4 className="font-semibold mb-2">{title}</h4>
      <div className="space-y-2">
        {items.map(it=> (
          <div key={it.id} className="flex gap-3 items-center" onClick={()=>onOpen(it)}>
            <img src={it.image} className="w-16 h-12 object-cover rounded" />
            <div className="text-sm">
              <div className="font-medium line-clamp-2">{it.title}</div>
              <div className="text-xs text-gray-500">{it.published}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SidebarTop({ items }){
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
      <h4 className="font-semibold mb-2">Notícias rápidas</h4>
      <ul className="space-y-2 text-sm">
        {items.map(i=> (
          <li key={i.id} className="line-clamp-2">{i.text}</li>
        ))}
      </ul>
    </div>
  );
}

function WeatherWidget({ city }){
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
      <h4 className="font-semibold">Previsão do tempo</h4>
      <div className="mt-2 text-sm">{city} • Ensolarado • 28°C</div>
      <div className="mt-3 text-xs text-gray-500">(Integração com API de clima recomendada: OpenWeather/ClimaTempo)</div>
    </div>
  );
}

function CurrencyWidget(){
  // Stub: In production fetch from API and cache results
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
      <h4 className="font-semibold">Câmbio</h4>
      <div className="mt-2 text-sm">Dólar (USD): R$ 5.25 • Euro (EUR): R$ 5.65</div>
      <div className="mt-2 text-xs text-gray-500">(Atualize com API de câmbio)</div>
    </div>
  );
}

function PopularWidget({ items, onOpen }){
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
      <h4 className="font-semibold">Mais lidas</h4>
      <ol className="mt-2 space-y-2 text-sm">
        {items.map(i=> (
          <li key={i.id} className="cursor-pointer" onClick={()=>onOpen(i)}>{i.title}</li>
        ))}
      </ol>
    </div>
  );
}

function ArticleCard({ item, onOpen }){
  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md cursor-pointer" onClick={()=>onOpen(item)}>
      <img src={item.image} className="w-full h-40 object-cover rounded mb-3" />
      <h4 className="font-semibold">{item.title}</h4>
      <p className="text-xs text-gray-500">{item.author} • {item.published} • {item.readTime} min</p>
    </article>
  );
}

// ---------- Article Modal / Page ----------
function ArticleModal({ item, onClose, related=[] }){
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black/40 p-4">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-start">
          <div>
            <div className="text-sm text-gray-500">{item.category}</div>
            <h2 className="text-2xl font-bold mt-1">{item.title}</h2>
            <div className="text-xs text-gray-500 mt-2">{item.author} • {item.published} • {item.readTime} min de leitura</div>
          </div>
          <div className="flex items-start gap-2">
            <button className="px-3 py-1 text-sm rounded border" onClick={()=>alert('Compartilhar via API')}>Compartilhar</button>
            <button className="text-xl" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <img src={item.image} className="w-full h-64 object-cover rounded" />
          <p className="prose max-w-none dark:prose-invert">{item.content}</p>

          <div className="space-y-2">
            <h4 className="font-semibold">Mídia</h4>
            <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">Vídeo incorporado / infográfico (iframe)</div>
          </div>

          <div>
            <h4 className="font-semibold">Notícias relacionadas</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              {related.map(r=> (
                <div key={r.id} className="p-3 border rounded hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">{r.title}</div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold">Comentários</h4>
            <CommentsPlaceholder />
          </div>
        </div>

        <div className="p-4 border-t dark:border-gray-700 text-sm flex justify-between items-center">
          <div>© {new Date().getFullYear()} ClickNews Brasil — Todos os direitos reservados</div>
          <div className="flex items-center gap-3">
            <a href="#" aria-label="facebook">FB</a>
            <a href="#" aria-label="twitter">X</a>
            <a href="#" aria-label="instagram">IG</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function CommentsPlaceholder(){
  return (
    <div className="space-y-3">
      <div className="text-xs text-gray-500">Sistema de comentários (recomendado: Disqus, Commento, ou solução custom com moderação + CAPTCHA)</div>
      <textarea className="w-full p-3 border rounded bg-white dark:bg-gray-800" rows={4} placeholder="Deixe sua opinião..." />
      <div className="flex gap-2">
        <button className="px-3 py-2 rounded bg-blue-600 text-white">Enviar</button>
        <button className="px-3 py-2 rounded border">Cancelar</button>
      </div>
    </div>
  );
}

// ---------- Footer ----------
function Footer(){
  return (
    <footer className="mt-12 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="font-bold text-lg">ClickNews Brasil</div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Notícias em tempo real, análises e opinião. Credibilidade e qualidade editorial.</p>
          <div className="mt-4 flex gap-3 text-sm">
            <a href="#">Sobre</a>
            <a href="#">Contato</a>
            <a href="#">Anuncie</a>
          </div>
        </div>
        <div>
          <h5 className="font-semibold">Links rápidos</h5>
          <ul className="mt-2 text-sm text-gray-600 dark:text-gray-300 space-y-2">
            <li>Política de Privacidade</li>
            <li>Termos de Uso</li>
            <li>Fale com a Redação</li>
          </ul>
        </div>
        <div>
          <h5 className="font-semibold">Newsletter</h5>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Receba as principais notícias no seu e-mail.</p>
          <form id="newsletter" className="mt-3 flex gap-2">
            <input placeholder="seu@email.com" className="rounded px-3 py-2 border bg-white dark:bg-gray-800" />
            <button className="px-3 py-2 rounded bg-blue-600 text-white">Assinar</button>
          </form>
        </div>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 text-sm py-4 text-center">© {new Date().getFullYear()} ClickNews Brasil — Todos os direitos reservados</div>
    </footer>
  );
}

// ---------- Mock data helpers (replace with real API calls) ----------
function mockHeadlines(){
  return [1,2,3].map(i=>({
    id: 'h'+i,
    title: `Manchete principal ${i}: evento importante sacode o país`,
    subtitle: 'Resumo curto e atraente que complementa a manchete.',
    image: `https://picsum.photos/1200/600?random=${i}`,
    category: ['Política','Economia','Mundo'][i%3]
  }));
}

function mockFeed(){
  return Array.from({length:8}).map((_,i)=> mockFeedItem(i));
}

function mockFeedItem(i=0){
  const id = Math.random().toString(36).slice(2,9);
  return {
    id,
    title: `Notícia ${id.substring(0,5)}: título curto e informativo`,
    excerpt: 'Resumo curto da notícia para prender a atenção do leitor no feed. Leia mais na matéria completa.',
    image: `https://picsum.photos/400/300?random=${Math.abs(id.charCodeAt(0))}`,
    author: ['Redação','João Silva','Maria Souza'][i%3],
    published: new Date().toLocaleString('pt-BR'),
    readTime: Math.floor(Math.random()*6)+2,
    content: 'Corpo da notícia com parágrafos, dados, citações e multimídia. Este é um conteúdo de exemplo para demonstrar o layout.',
    category: ['Últimas Notícias','Esportes','Tecnologia'][i%3]
  };
}

function mockCategoryItems(cat){
  return Array.from({length:4}).map((_,i)=> ({
    id: `${cat}-${i}`,
    title: `${cat} — manchete curta ${i+1}`,
    image: `https://picsum.photos/200/150?random=${i+10}`,
    published: `${i+1}h atrás`
  }));
}

function mockSidebarQuick(){
  return Array.from({length:5}).map((_,i)=> ({ id: i, text: `Atualização rápida ${i+1}: evento em andamento` }));
}

function mockPopular(){
  return Array.from({length:5}).map((_,i)=> ({ id:i, title:`Matéria popular ${i+1}` }));
}

function mockRelated(item){
  return Array.from({length:4}).map((_,i)=> ({ id:`r${i}`, title:`Relacionado: variação sobre ${item.title.substring(0,25)}` }));
}


/*
  Implementation notes / next steps for production:
  - Split into components and routes (React Router / Next.js pages)
  - Use a head manager (react-helmet / Next.js Head) for SEO meta tags and structured data (JSON-LD)
  - Replace mock data with API calls (GraphQL / REST). Implement caching and server-side rendering for SEO.
  - Real-time feed: use Server-Sent Events (SSE) or WebSockets for live updates.
  - Comments: integrate a moderated system (Disqus, Commento) or self-hosted solution with spam protection.
  - Social sharing: implement Open Graph tags, Twitter Card tags and share endpoints for WhatsApp / X / Facebook.
  - Accessibility: ensure all images have alt text, keyboard navigation, and contrast checks.
  - Performance: lazy-load images (loading=\"lazy\" or IntersectionObserver), use responsive images (srcset), compress assets, enable CDN.
  - Admin panel: separate app (protected) to create/edit/publish articles with roles (editor, admin, author).
  - Analytics and monitoring: add privacy-conscious analytics + error monitoring.
*/
