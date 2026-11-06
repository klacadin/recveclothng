import { Link } from "react-router-dom";
import { useArticles } from "@/hooks/useArticles";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";

const News = () => {
  const { data: articles = [], isLoading } = useArticles();

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="News & Updates"
        description="Latest news, updates, and articles from REVE Clothing. Running tips, new arrivals, and community stories."
        url="/news"
      />
      <Header />
      <main className="pt-20">
        <section className="bg-primary text-primary-foreground py-12">
          <div className="container">
            <nav className="text-xs text-primary-foreground/60 mb-4">
              <Link to="/" className="hover:text-primary-foreground">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-primary-foreground">News & Updates</span>
            </nav>
            <h1 className="font-display text-3xl md:text-4xl font-bold">
              News & Updates
            </h1>
            <p className="text-primary-foreground/80 mt-2">
              Stay in the loop with the latest from REVE Clothing
            </p>
          </div>
        </section>

        <div className="container py-12">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-lg">No articles yet.</p>
              <p className="text-sm mt-2">Check back soon for updates!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  to={`/news/${article.slug}`}
                  className="group bg-card border border-border rounded-lg overflow-hidden hover:border-accent transition-colors"
                >
                  {article.image_url && (
                    <div className="aspect-video bg-secondary overflow-hidden">
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {article.source === 'facebook' ? 'Facebook' : 'Blog'}
                    </span>
                    <h2 className="font-display text-lg font-bold text-foreground mt-1 group-hover:text-accent transition-colors line-clamp-2">
                      {article.title}
                    </h2>
                    {article.excerpt && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-4">
                      {new Date(article.published_at).toLocaleDateString('en-PH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default News;
