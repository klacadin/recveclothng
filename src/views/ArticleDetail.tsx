import { Link, useParams } from "react-router-dom";
import { useArticle } from "@/hooks/useArticles";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import { sanitizeHtml } from "@/utils/sanitizeHtml";

const ArticleDetail = () => {
  const { slug } = useParams();
  const { data: article, isLoading } = useArticle(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <div className="container py-16 flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <div className="container py-16 text-center">
            <h1 className="text-2xl font-bold">Article not found</h1>
            <Link to="/news" className="text-accent hover:underline mt-4 inline-block">
              ← Back to News
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={article.title}
        description={article.excerpt || article.title}
        image={article.image_url || undefined}
        url={`/news/${article.slug}`}
      />
      <Header />
      <main className="pt-20">
        <article>
          <header className="bg-primary text-primary-foreground py-12">
            <div className="container">
              <nav className="text-xs text-primary-foreground/60 mb-4">
                <Link to="/" className="hover:text-primary-foreground">Home</Link>
                <span className="mx-2">/</span>
                <Link to="/news" className="hover:text-primary-foreground">News</Link>
                <span className="mx-2">/</span>
                <span className="text-primary-foreground">{article.title}</span>
              </nav>
              <span className="text-xs font-medium uppercase tracking-wide opacity-80">
                {article.source === 'facebook' ? 'From Facebook' : 'Blog Post'}
              </span>
              <h1 className="font-display text-3xl md:text-4xl font-bold mt-2">
                {article.title}
              </h1>
              <p className="text-primary-foreground/80 mt-2">
                {new Date(article.published_at).toLocaleDateString('en-PH', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </header>

          <div className="container py-12">
            <div className="max-w-3xl mx-auto">
              {article.image_url && (
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full rounded-lg mb-8"
                />
              )}
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                {article.content ? (
                  <div
                    className="whitespace-pre-wrap text-foreground"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }}
                  />
                ) : (
                  <p className="text-muted-foreground">No content.</p>
                )}
              </div>
              {article.source_url && (
                <a
                  href={article.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-8 text-accent hover:underline"
                >
                  View original on Facebook →
                </a>
              )}
              <div className="mt-12 pt-8 border-t border-border">
                <Link to="/news" className="text-accent hover:underline">
                  ← Back to News & Updates
                </Link>
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default ArticleDetail;
