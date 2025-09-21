import { useState, useEffect } from "react";
import "./index.css";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");
  const [news] = useState([
    { id: 1, title: "Nova descoberta científica revoluciona a medicina" },
    { id: 2, title: "Economia brasileira cresce acima do esperado" },
    { id: 3, title: "Time local conquista título inédito" },
    { id: 4, title: "Tecnologia 6G começa a ser testada" },
  ]);

  // Salvar preferencia no navegador
  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  // Filtrar notícias pela pesquisa
  const filteredNews = news.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition">
      {/* Cabeçalho */}
      <header className="sticky top-0 bg-gray-100 dark:bg-gray-800 shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">ClickNews</h1>
        
        <input
          type="text"
          placeholder="Pesquisar notícias..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-2 py-1 rounded border dark:bg-gray-700 dark:border-gray-600"
        />

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="ml-4 px-3 py-1 bg-blue-500 text-white rounded"
        >
          {darkMode ? "☀️ Claro" : "🌙 Escuro"}
        </button>
      </header>

      {/* Lista de notícias */}
      <main className="p-6 grid gap-4">
        {filteredNews.length > 0 ? (
          filteredNews.map((n) => <NewsArticle key={n.id} news={n} />)
        ) : (
          <p>Nenhuma notícia encontrada.</p>
        )}
      </main>
    </div>
  );
}

// Página individual de notícia (simplificada)
function NewsArticle({ news }) {
  const [comments, setComments] = useState(
    JSON.parse(localStorage.getItem(`comments-${news.id}`)) || []
  );
  const [newComment, setNewComment] = useState("");

  const addComment = () => {
    if (newComment.trim() === "") return;
    const updated = [...comments, newComment];
    setComments(updated);
    localStorage.setItem(`comments-${news.id}`, JSON.stringify(updated));
    setNewComment("");
  };

  return (
    <article className="p-4 border rounded shadow bg-gray-50 dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-2">{news.title}</h2>
      
      <h3 className="font-semibold mt-4">Comentários:</h3>
      <ul className="mb-2">
        {comments.map((c, i) => (
          <li key={i} className="border-b border-gray-300 dark:border-gray-600 py-1">
            {c}
          </li>
        ))}
      </ul>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Escreva um comentário..."
          className="flex-1 px-2 py-1 rounded border dark:bg-gray-700 dark:border-gray-600"
        />
        <button
          onClick={addComment}
          className="px-3 py-1 bg-green-500 text-white rounded"
        >
          Enviar
        </button>
      </div>
    </article>
  );
}
