import { useEffect, useRef, useState } from "react";
import { db, storage } from "@/integrations/firebase/client";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  FileText,
  Plus,
  Pencil,
  Trash2,
  ImageIcon,
  Eye,
  EyeOff,
  Loader2,
  CalendarDays,
  User,
} from "lucide-react";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  published: boolean;
  createdAt: any;
  updatedAt: any;
}

type FormState = Omit<BlogPost, "id" | "createdAt" | "updatedAt">;

const BLANK_FORM: FormState = {
  title: "",
  slug: "",
  category: "",
  author: "",
  excerpt: "",
  content: "",
  coverImageUrl: "",
  published: false,
};

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function formatDate(ts: any): string {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

export function BlogManagement() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(BLANK_FORM);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Real-time listener for blog posts
  useEffect(() => {
    const q = query(collection(db, "blog_posts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as BlogPost)));
        setLoading(false);
      },
      (err) => {
        console.error("Blog posts fetch error:", err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(BLANK_FORM);
    setDialogOpen(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditingId(post.id);
    setForm({
      title: post.title,
      slug: post.slug,
      category: post.category,
      author: post.author,
      excerpt: post.excerpt,
      content: post.content,
      coverImageUrl: post.coverImageUrl || "",
      published: post.published,
    });
    setDialogOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setForm((prev) => ({
      ...prev,
      title: val,
      slug: editingId ? prev.slug : slugify(val),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    setUploadingImage(true);
    try {
      const path = `blog_images/${Date.now()}_${file.name}`;
      const sRef = storageRef(storage, path);
      await uploadBytes(sRef, file);
      const url = await getDownloadURL(sRef);
      setForm((prev) => ({ ...prev, coverImageUrl: url }));
      toast.success("Cover image uploaded successfully.");
    } catch (err: any) {
      toast.error("Image upload failed", { description: err.message });
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Please enter a post title.");
      return;
    }
    if (!form.excerpt.trim()) {
      toast.error("Please enter a short excerpt for the card highlight.");
      return;
    }
    if (!form.content.trim()) {
      toast.error("Please enter the full article content.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        slug: form.slug || slugify(form.title),
        updatedAt: serverTimestamp(),
      };
      if (editingId) {
        await updateDoc(doc(db, "blog_posts", editingId), payload);
        toast.success("Article updated successfully!");
      } else {
        await addDoc(collection(db, "blog_posts"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        toast.success("Article published successfully!");
      }
      setDialogOpen(false);
    } catch (err: any) {
      toast.error("Failed to save article", { description: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (post: BlogPost) => {
    try {
      await updateDoc(doc(db, "blog_posts", post.id), {
        published: !post.published,
        updatedAt: serverTimestamp(),
      });
      toast.success(post.published ? "Post unpublished." : "Post published to live site!");
    } catch (err: any) {
      toast.error("Failed to update publish status.", { description: err.message });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteDoc(doc(db, "blog_posts", deleteTarget.id));
      toast.success("Article deleted.");
    } catch (err: any) {
      toast.error("Failed to delete article.", { description: err.message });
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <>
      <Card className="border border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Blog Post Management</CardTitle>
                <CardDescription className="text-xs">
                  Create, edit and publish articles visible on the public Blog page.
                </CardDescription>
              </div>
            </div>
            <Button size="sm" variant="gold" onClick={openCreate} id="create-blog-post-btn">
              <Plus className="h-4 w-4 mr-1" /> New Article
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground text-sm gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading articles…
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-14 text-muted-foreground">
              <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">No articles yet.</p>
              <p className="text-xs mt-1">Click "New Article" to write and publish your first blog post.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-start gap-4 p-4 rounded-xl border border-border bg-secondary/20 hover:bg-secondary/40 transition-colors"
                >
                  {/* Cover thumbnail */}
                  {post.coverImageUrl ? (
                    <img
                      src={post.coverImageUrl}
                      alt={post.title}
                      className="h-16 w-24 rounded-lg object-cover shrink-0 border border-border"
                    />
                  ) : (
                    <div className="h-16 w-24 rounded-lg bg-muted flex items-center justify-center shrink-0 border border-border">
                      <ImageIcon className="h-5 w-5 text-muted-foreground/50" />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-semibold text-foreground truncate">{post.title}</span>
                      <Badge variant={post.published ? "default" : "secondary"} className="text-[10px] shrink-0">
                        {post.published ? "Published" : "Draft"}
                      </Badge>
                      {post.category && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                          {post.category}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-1.5">{post.excerpt}</p>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                      {post.author && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" /> {post.author}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" /> {formatDate(post.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      title={post.published ? "Unpublish" : "Publish"}
                      onClick={() => handleTogglePublish(post)}
                    >
                      {post.published ? (
                        <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                      ) : (
                        <Eye className="h-3.5 w-3.5 text-primary" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      title="Edit"
                      onClick={() => openEdit(post)}
                    >
                      <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 hover:text-destructive"
                      title="Delete"
                      onClick={() => setDeleteTarget(post)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Article" : "New Blog Article"}</DialogTitle>
            <DialogDescription>
              Fill in the article details below. The excerpt is shown as a highlight card; visitors tap "Read More" for the full content.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 pt-2">
            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor="blog-title">Article Title *</Label>
              <Input
                id="blog-title"
                placeholder="e.g. Why Palm Oil Quality Matters for Your Kitchen"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <Label htmlFor="blog-slug">URL Slug</Label>
              <Input
                id="blog-slug"
                placeholder="auto-generated from title"
                value={form.slug}
                onChange={(e) => setForm((p) => ({ ...p, slug: slugify(e.target.value) }))}
                className="font-mono text-xs"
              />
              <p className="text-[10px] text-muted-foreground">Used in the URL, e.g. /blog/{form.slug || "slug-here"}</p>
            </div>

            {/* Category + Author */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="blog-category">Category</Label>
                <Input
                  id="blog-category"
                  placeholder="e.g. Quality, Recipes, News"
                  value={form.category}
                  onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="blog-author">Author Name</Label>
                <Input
                  id="blog-author"
                  placeholder="e.g. LeemsDTT Team"
                  value={form.author}
                  onChange={(e) => setForm((p) => ({ ...p, author: e.target.value }))}
                />
              </div>
            </div>

            {/* Cover Image */}
            <div className="space-y-1.5">
              <Label>Cover Image (optional)</Label>
              {form.coverImageUrl && (
                <div className="relative">
                  <img
                    src={form.coverImageUrl}
                    alt="Cover preview"
                    className="w-full h-40 object-cover rounded-lg border border-border"
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2 h-7 text-xs"
                    onClick={() => setForm((p) => ({ ...p, coverImageUrl: "" }))}
                  >
                    Remove
                  </Button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full text-xs gap-2"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
              >
                {uploadingImage ? (
                  <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading…</>
                ) : (
                  <><ImageIcon className="h-3.5 w-3.5" /> {form.coverImageUrl ? "Replace Image" : "Upload Cover Image"}</>
                )}
              </Button>
            </div>

            {/* Excerpt */}
            <div className="space-y-1.5">
              <Label htmlFor="blog-excerpt">Excerpt / Highlight * <span className="text-muted-foreground font-normal text-[10px]">(shown on the card — keep under 200 chars)</span></Label>
              <Textarea
                id="blog-excerpt"
                placeholder="A short compelling summary that will be shown on the blog card before the visitor taps Read More…"
                value={form.excerpt}
                onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
                rows={3}
                maxLength={300}
              />
              <p className="text-[10px] text-muted-foreground text-right">{form.excerpt.length}/300</p>
            </div>

            {/* Full Content */}
            <div className="space-y-1.5">
              <Label htmlFor="blog-content">Full Article Content *</Label>
              <Textarea
                id="blog-content"
                placeholder="Write the complete article content here. This appears when the visitor taps 'Read More' on the public site."
                value={form.content}
                onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                rows={12}
                className="font-mono text-xs leading-relaxed"
              />
            </div>

            {/* Publish toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/30">
              <div>
                <p className="text-sm font-medium text-foreground">Publish to live site</p>
                <p className="text-xs text-muted-foreground">Toggle off to save as a draft only.</p>
              </div>
              <Switch
                id="blog-published"
                checked={form.published}
                onCheckedChange={(v) => setForm((p) => ({ ...p, published: v }))}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-1">
              <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
                Cancel
              </Button>
              <Button variant="gold" onClick={handleSave} disabled={saving || uploadingImage}>
                {saving ? (
                  <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Saving…</>
                ) : editingId ? (
                  "Save Changes"
                ) : (
                  "Publish Article"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Article?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>"{deleteTarget?.title}"</strong> from the blog. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Delete Article
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
