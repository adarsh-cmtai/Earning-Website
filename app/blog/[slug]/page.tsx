"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { notFound } from "next/navigation";
import Image from "next/image";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchBlogPostBySlug, clearCurrentPost } from "@/lib/redux/features/admin/blogSlice";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { User, Calendar, Facebook, Twitter, Linkedin, Loader2, ServerCrash } from "lucide-react";

function BlogPostSkeleton() {
  return (
    <div className="bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-4">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <Skeleton className="h-12 w-full max-w-3xl mb-4" />
          <Skeleton className="h-8 w-full max-w-xl mb-6" />
          <div className="flex items-center gap-6 mb-10">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-5 w-36" />
          </div>
          <Skeleton className="h-64 w-full mb-10 rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-11/12" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const dispatch = useDispatch<AppDispatch>();
  const [currentUrl, setCurrentUrl] = useState("");
  
  const {
    currentPost: post,
    status,
    error,
  } = useSelector((state: RootState) => state.adminBlog);

  useEffect(() => {
    if (params.slug) {
      dispatch(fetchBlogPostBySlug(params.slug));
    }
    setCurrentUrl(window.location.href);
    
    return () => {
      dispatch(clearCurrentPost());
    }
  }, [dispatch, params.slug]);

  const handleShare = (platform: 'facebook' | 'twitter' | 'linkedin') => {
    const postTitle = post ? encodeURIComponent(post.title) : "Check out this post!";
    const url = encodeURIComponent(currentUrl);
    let shareUrl = "";

    switch(platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${postTitle}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
    }
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  if (status === "loading") {
    return <BlogPostSkeleton />;
  }

  if (status === "failed" && !post) {
    if (error?.toLowerCase().includes('not found')) {
      notFound();
    }
    return (
       <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-grow flex flex-col justify-center items-center p-4">
            <Alert variant="destructive" className="max-w-xl">
            <ServerCrash className="h-5 w-5" />
            <AlertTitle>Failed to Load Post</AlertTitle>
            <AlertDescription>
                {error || "An unexpected error occurred while trying to retrieve the blog post. Please check your connection and try again later."}
            </AlertDescription>
            </Alert>
        </main>
        <Footer />
      </div>
    )
  }

  if (!post) {
    return <BlogPostSkeleton />;
  }

  return (
    <div className="bg-background text-foreground animate-fade-in">
      <Header />
      <main>
        <article>
          <header className="relative py-24 md:py-32 lg:py-40">
            <div className="absolute inset-0 z-0">
              <Image
                src={post.image.url}
                alt={`Background image for ${post.title}`}
                fill
                priority
                className="object-cover opacity-10"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
            </div>
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-4xl mx-auto text-center">
                <div className="flex flex-wrap gap-x-3 gap-y-2 justify-center mb-6">
                  {post.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-sm font-medium"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
                  {post.title}
                </h1>
                <div className="flex items-center justify-center flex-wrap gap-x-6 gap-y-2 text-muted-foreground text-base">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <time dateTime={post.createdAt}>
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <section className="py-12 md:py-16">
            <div className="container mx-auto px-4 max-w-3xl">
              <div
                className="prose dark:prose-invert prose-lg max-w-none 
                  prose-p:text-muted-foreground
                  prose-headings:text-foreground
                  prose-strong:text-foreground
                  prose-a:text-primary hover:prose-a:text-primary/80
                  prose-blockquote:border-l-primary
                  prose-ul:marker:text-primary
                  prose-ol:marker:text-primary
                  prose-img:rounded-xl prose-img:border prose-img:border-border
                  prose-code:bg-muted prose-code:text-muted-foreground prose-code:px-1.5 prose-code:py-1 prose-code:rounded-md
                "
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </section>

          <section className="py-12 md:py-16">
            <div className="container mx-auto px-4 max-w-3xl">
              <div className="mt-12 pt-10 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-6">
                <h3 className="font-semibold text-lg text-foreground">
                  Share This Post
                </h3>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Share on Twitter"
                    onClick={() => handleShare('twitter')}
                  >
                    <Twitter className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Share on Facebook"
                    onClick={() => handleShare('facebook')}
                  >
                    <Facebook className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Share on LinkedIn"
                    onClick={() => handleShare('linkedin')}
                  >
                    <Linkedin className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
