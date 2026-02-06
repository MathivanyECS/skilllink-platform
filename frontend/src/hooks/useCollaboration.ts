/**
 * Custom Hooks for Collaboration Module
 * 
 * Provides reusable hooks for fetching and managing collaboration data.
 * Handles loading states and errors consistently.
 */

import { useState, useEffect } from "react";
import {
    CollaborationPost,
    CollaborationApplication
} from "../types/collaboration.types";
import {
    getAllPosts,
    getPostById,
    getPostApplications
} from "../services/collaborationService";

/**
 * Hook to fetch all open collaboration posts
 * Automatically refetches when dependencies change
 */
export const useCollaborationPosts = () => {
    const [posts, setPosts] = useState<CollaborationPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllPosts();
            setPosts(data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to load posts");
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return { posts, loading, error, refetch: fetchPosts };
};

/**
 * Hook to fetch a single collaboration post by ID
 */
export const useCollaborationPost = (postId: string | null) => {
    const [post, setPost] = useState<CollaborationPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPost = async () => {
        if (!postId) {
            setPost(null);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await getPostById(postId);
            setPost(data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to load post");
            setPost(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPost();
    }, [postId]);

    return { post, loading, error, refetch: fetchPost };
};

/**
 * Hook to fetch applications for a post (owner only)
 */
export const usePostApplications = (postId: string | null) => {
    const [applications, setApplications] = useState<CollaborationApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchApplications = async () => {
        if (!postId) {
            setApplications([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await getPostApplications(postId);
            setApplications(data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to load applications");
            setApplications([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, [postId]);

    return { applications, loading, error, refetch: fetchApplications };
};
