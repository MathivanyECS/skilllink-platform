
import { useState, useEffect, useCallback } from "react";
// Hooks
import { CollaborationPost, CollaborationApplication } from "../types/collaboration.types";
import * as collaborationService from "../services/collaborationService";
import toast from "react-hot-toast";

export const useCollaborationPosts = () => {
    const [posts, setPosts] = useState<CollaborationPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPosts = useCallback(async () => {
        try {
            setLoading(true);
            const data = await collaborationService.getAllPosts();
            setPosts(data);
            setError(null);
        } catch (err: any) {
            console.error(err);
            setError("Failed to load collaboration posts.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    return { posts, loading, error, refetch: fetchPosts };
};

export const useCollaborationPost = (postId: string | null) => {
    const [post, setPost] = useState<CollaborationPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPost = useCallback(async () => {
        if (!postId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const data = await collaborationService.getPostById(postId);
            setPost(data);
            setError(null);
        } catch (err: any) {
            console.error(err);
            setError("Failed to load post details.");
        } finally {
            setLoading(false);
        }
    }, [postId]);

    useEffect(() => {
        fetchPost();
    }, [fetchPost]);

    return { post, loading, error, refetch: fetchPost };
};

export const usePostApplications = (postId: string | null) => {
    const [applications, setApplications] = useState<CollaborationApplication[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchApplications = useCallback(async () => {
        if (!postId) return;

        try {
            setLoading(true);
            const data = await collaborationService.getApplications(postId);
            setApplications(data);
            setError(null);
        } catch (err: any) {
            console.error(err);
            setError("Failed to monitor applications.");
        } finally {
            setLoading(false);
        }
    }, [postId]);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    return { applications, loading, error, refetch: fetchApplications };
};