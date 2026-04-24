import React, { useState, useEffect, useRef, useMemo } from 'react';
import Fuse from 'fuse.js';
import { Search as SearchIcon } from 'lucide-react';
import { fetchArticles } from '../services/firebaseService';
import { Link } from 'react-router-dom';
import { getPublicArticlePath } from '../utils/articleRoutes';
import type { ArticleType } from './article';

interface Article {
  id: string;
  title: string;
  description: string;
  category: string;
  slug: string;
  type?: ArticleType;
}

export default function Search() {
  const [query, setQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadArticles = async () => {
      const data = await fetchArticles();
      setArticles(data as Article[]);
    };
    loadArticles();
  }, []);

  const fuse = useMemo(
    () =>
      new Fuse(articles, {
        keys: ['title', 'description', 'category'],
        threshold: 0.3,
      }),
    [articles]
  );

  const results = useMemo(() => {
    if (query.length > 2) {
      return fuse.search(query).map((result) => result.item);
    }
    return [];
  }, [query, fuse]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={searchRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Cerca nel sito"
        className="p-2 hover:bg-black/5 rounded-full transition-colors"
      >
        <SearchIcon size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-black/5 p-4 z-50">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Cerca un contenuto..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-black/10 focus:outline-none focus:border-[var(--color-accent)]"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <SearchIcon className="absolute left-3 top-2.5 text-black/30" size={18} />
          </div>

          <div className="max-h-60 overflow-y-auto">
            {results.length > 0
              ? results.map((article) => (
                  <Link
                    key={article.id}
                    to={getPublicArticlePath(article)}
                    className="block p-3 hover:bg-black/5 rounded-xl transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <h5 className="font-bold text-sm">{article.title}</h5>
                    <p className="text-xs text-black/50">{article.category}</p>
                  </Link>
                ))
              : query.length > 2 && (
                  <p className="text-center text-sm text-black/50">Nessun risultato trovato.</p>
                )}
          </div>
        </div>
      )}
    </div>
  );
}
