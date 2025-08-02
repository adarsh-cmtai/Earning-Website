"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllAdminBlogPosts as fetchAllBlogPosts } from "@/lib/redux/features/admin/blogSlice"; // Renaming to avoid conflict if you use user slice later
import { AppDispatch, RootState } from "@/lib/redux/store";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User, ArrowRight, Calendar, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default function BlogPage() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    posts: blogPosts,
    status,
    error,
  } = useSelector((state: RootState) => state.adminBlog);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchAllBlogPosts());
  }, [dispatch]);

  const categories = Array.from(
    new Set(blogPosts.flatMap((post) => post.tags))
  );

  const filteredPosts = blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const renderContent = () => {
    if (status === "loading") {
      return (
        <div className="flex justify-center items-center h-96">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      );
    }

    if (status === "failed") {
      return (
        <Alert variant="destructive" className="my-8">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error Fetching Posts</AlertTitle>
          <AlertDescription>
            {error || "Could not retrieve blog posts. Please try again later."}
          </AlertDescription>
        </Alert>
      );
    }
    
    if (filteredPosts.length === 0 && status === "succeeded") {
      return (
        <div className="text-center py-16">
          <h3 className="text-2xl font-semibold">No Posts Found</h3>
          <p className="text-slate-500 mt-2">Try a different search term or check back later for new content.</p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredPosts.map((post) => (
          <Card
            key={post._id}
            className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 transition-colors group"
          >
            <CardContent className="p-0">
              <div className="aspect-video bg-gray-100 dark:bg-slate-800 rounded-t-lg overflow-hidden">
                <Image
                  src={post.image.url || "/placeholder.svg"}
                  alt={post.title}
                  width={500}
                  height={281}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  priority={true}
                />
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs text-primary dark:text-teal-400 border-primary/50 dark:border-teal-400/50 bg-primary/10 dark:bg-teal-500/10"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Link href={`/blog/${post.slug}`} className="block">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-2 line-clamp-2 group-hover:text-primary dark:group-hover:text-teal-400 transition-colors">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-gray-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">
                  {post.description}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-500 pt-4 border-t border-gray-200 dark:border-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User className="h-3 w-3" />
                    <span>{post.author}</span>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-white">
      <Header />

      <main>
        <section className="relative py-16 md:py-16 text-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2028&auto=format&fit=crop"
              alt="Library with books and reading atmosphere"
              fill
              priority
              placeholder="empty"
              quality={100}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/60 backdrop-brightness-75 dark:backdrop-brightness-50"></div>
          </div>

          <div className="container mx-auto px-4 relative z-20">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-sky-400">
                Stay Informed, Stay Empowered
              </span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
              Your go-to source for platform announcements, expert tips, and
              powerful tutorials from the UEIEP team.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              <div className="lg:col-span-3">{renderContent()}</div>

              <aside className="lg:col-span-1 space-y-8">
                <Card className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900 dark:text-slate-100">
                      Search Blog
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-slate-500 h-4 w-4" />
                      <Input
                        placeholder="Search posts..."
                        className="pl-10 bg-gray-100 dark:bg-slate-800 border-gray-300 dark:border-slate-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900 dark:text-slate-100">
                      Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {categories.map((category) => (
                        <li key={category}>
                          <Link
                            href="#"
                            className="text-gray-600 dark:text-slate-400 hover:text-primary dark:hover:text-teal-400 flex items-center justify-between group"
                          >
                            <span>{category}</span>
                            <ArrowRight className="h-4 w-4 text-gray-400 dark:text-slate-600 group-hover:text-primary dark:group-hover:text-teal-400 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900 dark:text-slate-100">
                      Recent Posts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {blogPosts.slice(0, 3).map((post) => (
                        <li
                          key={post._id}
                          className="flex items-start space-x-4 group"
                        >
                          <Image
                            src={post.image.url || "/images/home/testimonial1.jpg"}
                            alt={post.title}
                            width={64}
                            height={64}
                            className="w-16 h-16 object-cover rounded-md flex-shrink-0 border border-gray-200 dark:border-slate-700"
                          />
                          <div>
                            <Link
                              href={`/blog/${post.slug}`}
                              className="font-medium text-gray-700 dark:text-slate-300 group-hover:text-primary dark:group-hover:text-teal-400 line-clamp-2 text-sm"
                            >
                              {post.title}
                            </Link>
                            <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
