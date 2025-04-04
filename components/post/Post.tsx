import { COLORS } from '@/constants/theme';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { toggleLike } from '@/convex/posts';
import { styles } from '@/styles/feed.styles';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from 'convex/react';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

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
    const [isLiked, setIsLiked] = useState(post.isLiked);
    const [likesCount, setLikesCount] = useState(post.likes);

    const toggleLike = useMutation(api.posts.toggleLike);

    const handleLike = async () => {
        try {
            const liked = await toggleLike({ postId: post._id });
            setIsLiked(liked);
            setLikesCount((prev) => (liked ? prev + 1 : prev - 1));
        } catch (error) {
            console.error('Error toggling like', error);
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

                {/* <TouchableOpacity>
                    <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.white} />
                </TouchableOpacity> */}

                <TouchableOpacity>
                    <Ionicons name="trash-outline" size={20} color={COLORS.primary} />
                </TouchableOpacity>
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
                    <TouchableOpacity>
                        <Ionicons name="chatbubble-outline" size={21} color={COLORS.white} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity>
                    <Ionicons name="bookmark-outline" size={22} color={COLORS.white} />
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

                <TouchableOpacity>
                    <Text style={styles.commentsText}>View all 2 comments</Text>
                </TouchableOpacity>

                <Text style={styles.timeAgo}>2 hours ago</Text>
            </View>
        </View>
    );
}
