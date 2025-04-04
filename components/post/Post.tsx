import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery } from 'convex/react';
import { formatDistanceToNow } from 'date-fns';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/constants/theme';
import { styles } from '@/styles/feed.styles';
import CommentsModal from '../comments/CommentsModal';
import { useUser } from '@clerk/clerk-expo';

type User = {
    _id?: Id<'users'>;
    username?: string;
    image?: string;
};

type Post = {
    _id: Id<'posts'>;
    storageId: Id<'_storage'>;
    _creationTime: number;
    caption?: string;
    likes: number;
    comments: number;
    author: User;
    isLiked: boolean;
    isBookmarked: boolean;
    imageUrl: string;
};

export default function Post({ post }: { post: Post }) {
    const { user } = useUser();

    const [isLiked, setIsLiked] = useState(post.isLiked);
    const [likesCount, setLikesCount] = useState(post.likes);

    const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);

    const [showCommentsModal, setShowCommentsModal] = useState(false);
    const [commentsCount, setCommentsCount] = useState(post.comments);

    const toggleLike = useMutation(api.posts.toggleLike);
    const toggleBookmark = useMutation(api.bookmarks.toggleBookmark);
    const deletePost = useMutation(api.posts.deletePost);

    const currentUser = useQuery(api.users.getUserByClerkId, user ? { clerkId: user?.id } : 'skip');

    const handleLike = async () => {
        try {
            const liked = await toggleLike({ postId: post._id });
            setIsLiked(liked);
            setLikesCount((prev) => (liked ? prev + 1 : prev - 1));
        } catch (error) {
            console.error('Error toggling like', error);
        }
    };

    const handleBookmark = async () => {
        try {
            const bookmarked = await toggleBookmark({ postId: post._id });
            setIsBookmarked(bookmarked);
        } catch (error) {
            console.error('Error toggling bookmark', error);
        }
    };

    const handleDelete = async () => {
        try {
            await deletePost({ postId: post._id });
        } catch (error) {
            console.error('Error deleting post', error);
        }
    };

    return (
        <View style={styles.post}>
            <View style={styles.postHeader}>
                <Link href="/(tabs)/notifications">
                    <TouchableOpacity style={styles.postHeaderLeft}>
                        <Image
                            source={post.author.image}
                            style={styles.postAvatar}
                            contentFit="cover"
                            cachePolicy="memory-disk"
                        />
                        <Text style={styles.postUsername}>{post.author.username}</Text>
                    </TouchableOpacity>
                </Link>

                {currentUser?._id === post.author._id ? (
                    <TouchableOpacity onPress={handleDelete}>
                        <Ionicons name="trash-outline" size={20} color={COLORS.primary} />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity>
                        <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.white} />
                    </TouchableOpacity>
                )}
            </View>

            <Image
                source={post.imageUrl}
                style={styles.postImage}
                contentFit="cover"
                transition={200}
                cachePolicy="memory-disk"
            />

            <View style={styles.postActions}>
                <View style={styles.postActionsLeft}>
                    <TouchableOpacity onPress={handleLike}>
                        <Ionicons
                            name={isLiked ? 'heart' : 'heart-outline'}
                            size={24}
                            color={isLiked ? COLORS.primary : COLORS.white}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowCommentsModal(true)}>
                        <Ionicons name="chatbubble-outline" size={21} color={COLORS.white} />
                    </TouchableOpacity>
                </View>
                {/* isBookmarked */}
                <TouchableOpacity onPress={handleBookmark}>
                    <Ionicons
                        name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                        size={22}
                        color={isBookmarked ? COLORS.primary : COLORS.white}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.postInfo}>
                {likesCount > 0 && <Text style={styles.likesText}>{likesCount} likes</Text>}
                {post.caption && (
                    <View style={styles.captionContainer}>
                        <Text style={styles.captionUsername}>{post.author.username}</Text>
                        <Text style={styles.captionText}>{post.caption}</Text>
                    </View>
                )}

                {commentsCount > 0 && (
                    <TouchableOpacity onPress={() => setShowCommentsModal(true)}>
                        <Text style={styles.commentsText}>
                            {commentsCount > 1
                                ? `View all ${commentsCount} comments`
                                : 'View comments'}
                        </Text>
                    </TouchableOpacity>
                )}

                <Text style={styles.timeAgo}>
                    {formatDistanceToNow(post._creationTime, { addSuffix: true })}
                </Text>
            </View>

            <CommentsModal
                postId={post._id}
                open={showCommentsModal}
                onCommentAdded={() => setCommentsCount((prev) => prev + 1)}
                onClose={() => setShowCommentsModal(false)}
            />
        </View>
    );
}
