import { useState, useRef } from "react";
import { Plus, Edit, Trash2, Upload, Loader2 } from "lucide-react";
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
import {
  useEventCarousel,
  useCreateEventCarouselItem,
  useUpdateEventCarouselItem,
  useDeleteEventCarouselItem,
  type EventCarouselItem,
} from "@/hooks/useEventCarousel";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useToast } from "@/hooks/use-toast";
import { MAX_EVENT_CAROUSEL_ITEMS } from "@/config/constants";

const EventCarouselManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<EventCarouselItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ image_url: "", title: "", caption: "" });
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { data: items = [], isLoading } = useEventCarousel();
  const createItem = useCreateEventCarouselItem();
  const updateItem = useUpdateEventCarouselItem();
  const deleteItem = useDeleteEventCarouselItem();
  const { uploadImage, isUploading } = useImageUpload();

  const resetForm = () => {
    setForm({ image_url: "", title: "", caption: "" });
    setEditing(null);
    setShowForm(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file);
    if (url) setForm((f) => ({ ...f, image_url: url }));
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image_url.trim() || !form.title.trim()) {
      toast({ title: "Image URL and title required", variant: "destructive" });
      return;
    }
    try {
      if (editing) {
        await updateItem.mutateAsync({
          id: editing.id,
          updates: {
            image_url: form.image_url.trim(),
            title: form.title.trim(),
            caption: form.caption.trim() || null,
          },
        });
        toast({ title: "Carousel item updated" });
      } else {
        if (items.length >= MAX_EVENT_CAROUSEL_ITEMS) {
          toast({
            title: "Limit reached",
            description: `Maximum ${MAX_EVENT_CAROUSEL_ITEMS} photos allowed.`,
            variant: "destructive",
          });
          return;
        }
        await createItem.mutateAsync({
          image_url: form.image_url.trim(),
          title: form.title.trim(),
          caption: form.caption.trim() || null,
        });
        toast({ title: "Carousel item added" });
      }
      resetForm();
    } catch (err) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteItem.mutateAsync(id);
      toast({ title: "Item deleted" });
      setDeleteId(null);
    } catch (err) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="font-semibold text-foreground">Event Carousel (Join Us section)</h3>
        <Button
          size="sm"
          onClick={() => {
            setEditing(null);
            setForm({ image_url: "", title: "", caption: "" });
            setShowForm(true);
          }}
          disabled={items.length >= MAX_EVENT_CAROUSEL_ITEMS}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Photo
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Up to {MAX_EVENT_CAROUSEL_ITEMS} photos. New photos appear first. Shown in the auto-carousel on the homepage.
      </p>

      {isLoading ? (
        <div className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <div className="p-8 text-center bg-card border border-border rounded-sm">
          <p className="text-muted-foreground">No carousel photos yet.</p>
          <p className="text-sm text-muted-foreground mt-1">Add photos to display in the Join Us section.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-card border border-border rounded-sm overflow-hidden"
            >
              <div className="aspect-[4/3] overflow-hidden bg-secondary">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <p className="font-medium text-foreground truncate">{item.title}</p>
                {item.caption && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{item.caption}</p>
                )}
              </div>
              <div className="flex gap-2 p-3 pt-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditing(item);
                    setForm({
                      image_url: item.image_url,
                      title: item.title,
                      caption: item.caption || "",
                    });
                    setShowForm(true);
                  }}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setDeleteId(item.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Carousel Photo" : "Add Carousel Photo"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update the photo, title, and caption." : "Add a new photo to the Join Us carousel."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Image</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={form.image_url}
                  onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                  placeholder="Image URL or upload"
                  className="flex-1"
                />
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                </Button>
              </div>
              {form.image_url && (
                <div className="mt-2 aspect-video w-32 rounded overflow-hidden bg-secondary">
                  <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Photo title"
                required
              />
            </div>
            <div>
              <Label htmlFor="caption">Caption (optional)</Label>
              <Textarea
                id="caption"
                value={form.caption}
                onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value }))}
                placeholder="Short description"
                rows={2}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit" disabled={createItem.isPending || updateItem.isPending}>
                {editing ? "Update" : "Add"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete carousel photo?</DialogTitle>
            <DialogDescription>This cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteId && handleDelete(deleteId)} disabled={deleteItem.isPending}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventCarouselManagement;
