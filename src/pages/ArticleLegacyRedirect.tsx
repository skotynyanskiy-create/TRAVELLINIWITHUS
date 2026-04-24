import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import ArticlePageSkeleton from '../components/ArticlePageSkeleton';
import NotFound from './NotFound';
import { PREVIEW_ARTICLES } from '../config/previewContent';
import { fetchArticleBySlug } from '../services/firebaseService';
import { getPublicArticlePath } from '../utils/articleRoutes';

export default function ArticleLegacyRedirect() {
  const { slug } = useParams();
  const currentSlug = slug || '';
  const preview = PREVIEW_ARTICLES[currentSlug];
  const previewTargetPath = preview
    ? getPublicArticlePath({
        slug: preview.slug,
        category: preview.category,
        type: preview.type,
      })
    : null;
  const [targetPath, setTargetPath] = useState<string | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (previewTargetPath) {
      return;
    }

    const load = async () => {
      if (!currentSlug) {
        setMissing(true);
        return;
      }

      try {
        const article = await fetchArticleBySlug(currentSlug);

        if (!article) {
          setMissing(true);
          return;
        }

        setTargetPath(
          getPublicArticlePath({
            id: article.id,
            slug: article.slug,
            category: article.category,
            type: article.type,
          })
        );
      } catch (error) {
        console.error('Error resolving legacy article route:', error);
        setMissing(true);
      }
    };

    load();
  }, [currentSlug, previewTargetPath]);

  if (previewTargetPath || targetPath) {
    return <Navigate to={previewTargetPath || targetPath || '/guide'} replace />;
  }

  if (missing) {
    return <NotFound />;
  }

  return (
    <PageLayout>
      <ArticlePageSkeleton />
    </PageLayout>
  );
}
