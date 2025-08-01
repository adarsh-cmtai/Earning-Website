// lib/redux/features/user/blogSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// UPDATED: The BlogPost interface now matches the S3 backend model
export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  image: {
    key: string; // The file key in the S3 bucket
    url: string; // The public URL of the image from S3
  };
  description: string;
  content: string;
  tags: string[];
  author: string;
  createdAt: string;
  updatedAt: string;
}

// The rest of this file remains the same, as it's for reading data.
interface BlogState {
  posts: BlogPost[];
  currentPost: BlogPost | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: BlogState = {
  posts: [],
  currentPost: null,
  status: "idle",
  error: null,
};

export const fetchAllBlogPosts = createAsyncThunk(
  "userBlog/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/users/blog");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data.message || "Failed to fetch posts"
      );
    }
  }
);

export const fetchBlogPostBySlug = createAsyncThunk(
  "userBlog/fetchBySlug",
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/users/blog/${slug}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data.message || "Failed to fetch post"
      );
    }
  }
);

const userBlogSlice = createSlice({
  name: "userBlog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBlogPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchAllBlogPosts.fulfilled,
        (state, action: PayloadAction<BlogPost[]>) => {
          state.status = "succeeded";
          state.posts = action.payload;
        }
      )
      .addCase(fetchAllBlogPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchBlogPostBySlug.pending, (state) => {
        state.status = "loading";
        state.currentPost = null;
      })
      .addCase(
        fetchBlogPostBySlug.fulfilled,
        (state, action: PayloadAction<BlogPost>) => {
          state.status = "succeeded";
          state.currentPost = action.payload;
        }
      )
      .addCase(fetchBlogPostBySlug.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default userBlogSlice.reducer;
