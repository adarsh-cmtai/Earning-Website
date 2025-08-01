import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../../axios";
import { BlogPost } from "../user/blogSlice"; // Re-use the existing BlogPost type

// Types for Async Thunk arguments
interface UpdateBlogPostArgs {
  id: string;
  formData: FormData;
}

// State interface for admin blog management
interface AdminBlogState {
  posts: BlogPost[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AdminBlogState = {
  posts: [],
  status: "idle",
  error: null,
};

// =================================================================
// ASYNC THUNKS for Admin CRUD Operations
// =================================================================

// 1. Fetch all posts for the admin dashboard
export const fetchAllAdminBlogPosts = createAsyncThunk(
  "adminBlog/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      // API endpoint from your routes: GET /api/admin/blog
      const response = await axiosInstance.get("/admin/blogs/blog");
      return response.data as BlogPost[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data.message || "Failed to fetch blog posts."
      );
    }
  }
);

// 2. Create a new blog post
export const createBlogPost = createAsyncThunk(
  "adminBlog/create",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      // API endpoint from your routes: POST /api/admin/blog
      const response = await axiosInstance.post("/admin/blogs/blog", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data as BlogPost;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data.message || "Failed to create blog post."
      );
    }
  }
);

// 3. Update an existing blog post
export const updateBlogPost = createAsyncThunk(
  "adminBlog/update",
  async ({ id, formData }: UpdateBlogPostArgs, { rejectWithValue }) => {
    try {
      // API endpoint from your routes: PUT /api/admin/blog/:id
      const response = await axiosInstance.put(`/admin/blogs/blog/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data as BlogPost;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data.message || "Failed to update blog post."
      );
    }
  }
);

// 4. Delete a blog post
export const deleteBlogPost = createAsyncThunk(
  "adminBlog/delete",
  async (postId: string, { rejectWithValue }) => {
    try {
      // API endpoint from your routes: DELETE /api/admin/blog/:id
      await axiosInstance.delete(`/admin/blogs/blog/${postId}`);
      return postId; // Return the ID on success for filtering the state
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data.message || "Failed to delete blog post."
      );
    }
  }
);

// =================================================================
// SLICE DEFINITION
// =================================================================

const adminBlogSlice = createSlice({
  name: "adminBlog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All Posts
      .addCase(fetchAllAdminBlogPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchAllAdminBlogPosts.fulfilled,
        (state, action: PayloadAction<BlogPost[]>) => {
          state.status = "succeeded";
          state.posts = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchAllAdminBlogPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Create Post
      .addCase(createBlogPost.pending, (state) => {
        state.status = "loading"; // Or a specific 'submitting' status
      })
      .addCase(
        createBlogPost.fulfilled,
        (state, action: PayloadAction<BlogPost>) => {
          state.status = "succeeded";
          // Add the new post to the beginning of the array
          state.posts.unshift(action.payload);
          state.error = null;
        }
      )
      .addCase(createBlogPost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Update Post
      .addCase(updateBlogPost.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        updateBlogPost.fulfilled,
        (state, action: PayloadAction<BlogPost>) => {
          state.status = "succeeded";
          // Find the post in the array and replace it with the updated one
          const index = state.posts.findIndex(
            (post) => post._id === action.payload._id
          );
          if (index !== -1) {
            state.posts[index] = action.payload;
          }
          state.error = null;
        }
      )
      .addCase(updateBlogPost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Delete Post
      .addCase(deleteBlogPost.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        deleteBlogPost.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "succeeded";
          // Filter out the deleted post from the array using the returned ID
          state.posts = state.posts.filter(
            (post) => post._id !== action.payload
          );
          state.error = null;
        }
      )
      .addCase(deleteBlogPost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default adminBlogSlice.reducer;
