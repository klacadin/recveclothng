import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, RefreshCw, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useArticles, useCreateArticle, useUpdateArticle, useDeleteArticle, type Article } from "@/hooks/useArticles";
import { useToast } from "@/hooks/use-toast";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

interface ArticleManagementProps {
  openFormImmediately?: boolean;
  onFormOpened?: () => void;
}

const ArticleManagement = ({ openFormImmediately, onFormOpened }: ArticleManagementProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Article | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', image_url: '' });
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();
  const { data: articles = [], isLoading, refetch } = useArticles();
  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();
  const deleteArticle = useDeleteArticle();

  useEffect(() => {
    if (openFormImmediately) {
      setShowForm(true);
      onFormOpened?.();
    }
  }, [openFormImmediately, onFormOpened]);

  const resetForm = () => {
    setForm({ title: '', excerpt: '', content: '', image_url: '' });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast({ title: 'Title required', variant: 'destructive' });
      return;
    }
    try {
      if (editing) {
        await updateArticle.mutateAsync({
          id: editing.id,
          updates: {
            title: form.title.trim(),
            excerpt: form.excerpt.trim() || null,
            content: form.content.trim() || null,
            image_url: form.image_url.trim() || null,
          },
        });
        toast({ title: 'Article updated' });
      } else {
        await createArticle.mutateAsync({
          title: form.title.trim(),
          slug: slugify(form.title),
          excerpt: form.excerpt.trim() || null,
          content: form.content.trim() || null,
          image_url: form.image_url.trim() || null,
          source: 'manual',
        });
        toast({ title: 'Article created' });
      }
      resetForm();
    } catch (err) {
      toast({ title: 'Error', description: (err as Error).message, variant: 'destructive' });
    }
  };

  const handleSyncFacebook = async () => {
    setIsSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-facebook-posts');
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast({ title: 'Facebook sync complete', description: data?.message || 'Posts synced.' });
      refetch();
    } catch (err) {
      toast({ title: 'Sync failed', description: (err as Error).message, variant: 'destructive' });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteArticle.mutateAsync(id);
      toast({ title: 'Article deleted' });
      setDeleteId(null);
    } catch (err) {
      toast({ title: 'Error', description: (err as Error).message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="font-semibold text-foreground">News & Blog Articles</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSyncFacebook}
            disabled={isSyncing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            Sync from Facebook
          </Button>
          <Button size="sm" onClick={() => { setEditing(null); setForm({ title: '', excerpt: '', content: '', image_url: '' }); setShowForm(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Article
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
        </div>
      ) : articles.length === 0 ? (
        <div className="p-8 text-center bg-card border border-border rounded-sm">
          <p className="text-muted-foreground">No articles yet.</p>
          <p className="text-sm text-muted-foreground mt-1">Add one manually or sync from Facebook.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {articles.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between p-4 bg-card border border-border rounded-sm"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{a.title}</p>
                <p className="text-xs text-muted-foreground">
                  {a.source} • {new Date(a.published_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => window.open(`/news/${a.slug}`, '_blank')}
                  aria-label="View"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                {a.source === 'manual' && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      setEditing(a);
                      setForm({
                        title: a.title,
                        excerpt: a.excerpt || '',
                        content: a.content || '',
                        image_url: a.image_url || '',
                      });
                      setShowForm(true);
                    }}
                    aria-label="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => setDeleteId(a.id)}
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Article' : 'Add Article'}</DialogTitle>
            <DialogDescription>
              {editing ? 'Update the article content.' : 'Create a new blog article.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Article title"
                required
              />
            </div>
            <div>
              <Label htmlFor="excerpt">Excerpt (optional)</Label>
              <Input
                id="excerpt"
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                placeholder="Short summary"
              />
            </div>
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                placeholder="Article body (supports HTML)"
                rows={6}
                className="font-mono text-sm"
              />
            </div>
            <div>
              <Label htmlFor="image_url">Image URL (optional)</Label>
              <Input
                id="image_url"
                value={form.image_url}
                onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit" disabled={createArticle.isPending || updateArticle.isPending}>
                {editing ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete article?</DialogTitle>
            <DialogDescription>This cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteId && handleDelete(deleteId)} disabled={deleteArticle.isPending}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ArticleManagement;
