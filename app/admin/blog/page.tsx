// app/admin/blog/page.tsx

"use client";

import { useState, useEffect, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import {
  fetchAllAdminBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "@/lib/redux/features/admin/blogSlice";
import { type BlogPost } from "@/lib/redux/features/user/blogSlice";
import dynamic from "next/dynamic";
import Image from "next/image";
import "react-quill/dist/quill.snow.css";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { format } from "date-fns";

// Icons
import {
  MoreHorizontal,
  PlusCircle,
  Edit,
  Trash2,
  Upload,
  Image as ImageIcon,
} from "lucide-react";

// Dynamically import ReactQuill to prevent Server-Side Rendering issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

type ModalType = "create" | "edit" | null;

export default function AdminBlogPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, status } = useSelector((state: RootState) => state.adminBlog);

  const [modalOpen, setModalOpen] = useState<ModalType>(null);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost> | null>(
    null
  );
  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);

  // States for the form
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [content, setContent] = useState("");

  useEffect(() => {
    dispatch(fetchAllAdminBlogPosts());
  }, [dispatch]);

  const handleOpenCreateModal = () => {
    setCurrentPost({
      title: "",
      description: "",
      tags: [],
      author: "UEIEP Team",
    });
    setContent("");
    setModalOpen("create");
  };

  const handleOpenEditModal = (post: BlogPost) => {
    setCurrentPost(post);
    setContent(post.content);
    setImagePreview(post.image.url);
    setModalOpen("edit");
  };

  const handleOpenDeleteAlert = (post: BlogPost) => {
    setPostToDelete(post);
    setDeleteAlertOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(null);
    setCurrentPost(null);
    setImageFile(null);
    setImagePreview(null);
    setContent("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentPost) return;

    if (modalOpen === "create" && !imageFile) {
      toast.error("Please upload an image for the new post.");
      return;
    }

    const formData = new FormData();
    formData.append("title", currentPost.title!);
    formData.append("description", currentPost.description!);
    formData.append("content", content);
    formData.append("author", currentPost.author!);
    const tags = Array.isArray(currentPost.tags)
      ? currentPost.tags
      : String(currentPost.tags)
          .split(",")
          .map((t) => t.trim());
    formData.append("tags", JSON.stringify(tags));

    if (imageFile) {
      formData.append("image", imageFile);
    }

    const toastId = toast.loading(
      modalOpen === "edit" ? "Updating post..." : "Creating post..."
    );

    try {
      if (modalOpen === "edit" && currentPost._id) {
        await dispatch(
          updateBlogPost({ id: currentPost._id, formData })
        ).unwrap();
      } else {
        await dispatch(createBlogPost(formData)).unwrap();
      }
      toast.success("Post saved successfully.", { id: toastId });
      handleCloseModal();
    } catch (error: any) {
      toast.error(error?.message || "An error occurred.", { id: toastId });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;
    const toastId = toast.loading("Deleting post...");
    try {
      await dispatch(deleteBlogPost(postToDelete._id)).unwrap();
      toast.success("Post deleted successfully.", { id: toastId });
      setDeleteAlertOpen(false);
      setPostToDelete(null);
    } catch (error: any) {
      toast.error(error || "Failed to delete post.", { id: toastId });
    }
  };

  return (
    <>
      <main className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Blog Management
            </h1>
            <p className="text-muted-foreground">
              Create, edit, and manage all blog posts.
            </p>
          </div>
          <Button onClick={handleOpenCreateModal}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Post
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Blog Posts</CardTitle>
            <CardDescription>
              A list of all blog posts currently in the system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {status === "loading" &&
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={6} className="p-2">
                          <Skeleton className="h-12 w-full" />
                        </TableCell>
                      </TableRow>
                    ))}
                  {status === "succeeded" && posts.length > 0
                    ? posts.map((post) => (
                        <TableRow key={post._id}>
                          <TableCell>
                            <div className="w-16 h-10 rounded-md bg-muted flex items-center justify-center">
                              <Image
                                src={post.image.url}
                                alt={post.title}
                                width={64}
                                height={40}
                                className="object-cover w-full h-full rounded-md"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {post.title}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {post.author}
                          </TableCell>
                          <TableCell className="space-x-1">
                            {post.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline">
                                {tag}
                              </Badge>
                            ))}
                          </TableCell>
                          <TableCell>
                            {format(new Date(post.createdAt), "PP")}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleOpenEditModal(post)}
                                >
                                  <Edit className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-500"
                                  onClick={() => handleOpenDeleteAlert(post)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    : status === "succeeded" && (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            No blog posts found. Create one to get started.
                          </TableCell>
                        </TableRow>
                      )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Create/Edit Post Modal */}
      <Dialog
        open={modalOpen !== null}
        onOpenChange={(isOpen) => !isOpen && handleCloseModal()}
      >
        <DialogContent className="sm:max-w-[725px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {modalOpen === "create" ? "Create New Post" : "Edit Post"}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleFormSubmit}
            className="flex-grow overflow-y-auto pr-4 grid gap-6 py-4"
          >
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={currentPost?.title || ""}
                onChange={(e) =>
                  setCurrentPost({ ...currentPost, title: e.target.value })
                }
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="image-upload" className="text-right pt-2">
                Image
              </Label>
              <div className="col-span-3">
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer border-2 border-dashed border-muted-foreground/50 rounded-lg p-6 flex flex-col items-center justify-center w-full hover:bg-muted/50 transition-colors"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-40 w-full object-cover rounded-md"
                    />
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                      <span className="mt-2 text-sm text-muted-foreground">
                        Click to upload
                      </span>
                      <span className="text-xs text-muted-foreground/80">
                        PNG, JPG, WEBP
                      </span>
                    </div>
                  )}
                </label>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tags" className="text-right">
                Tags
              </Label>
              <Input
                id="tags"
                value={(currentPost?.tags as any)?.join(", ") || ""}
                onChange={(e) =>
                  setCurrentPost({
                    ...currentPost,
                    tags: e.target.value.split(",").map((t) => t.trim()),
                  })
                }
                className="col-span-3"
                placeholder="e.g. Announcement, Tutorial"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Description
              </Label>
              <Textarea
                id="description"
                value={currentPost?.description || ""}
                onChange={(e) =>
                  setCurrentPost({
                    ...currentPost,
                    description: e.target.value,
                  })
                }
                className="col-span-3 min-h-[80px]"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Content</Label>
              <div className="col-span-3">
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  placeholder="Full blog content goes here..."
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="author" className="text-right">
                Author
              </Label>
              <Input
                id="author"
                value={currentPost?.author || ""}
                onChange={(e) =>
                  setCurrentPost({ ...currentPost, author: e.target.value })
                }
                className="col-span-3"
                required
              />
            </div>
            <DialogFooter className="sticky bottom-0 bg-background pt-4 pb-0 -mx-6 px-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
              <Button type="submit">
                {modalOpen === "create" ? "Create Post" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the blog post "{postToDelete?.title}
              ".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
