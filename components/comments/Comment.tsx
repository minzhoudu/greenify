import { styles } from '@/styles/feed.styles';
import { formatDistanceToNow } from 'date-fns';
import { Image, Text, View } from 'react-native';

type CommentProps = {
    comment: {
        _creationTime: number;
        content: string;
        user: {
            fullName: string;
            image: string;
        };
    };
};
export default function Comment({ comment }: CommentProps) {
    return (
        <View style={styles.commentContainer}>
            <Image source={{ uri: comment.user.image }} style={styles.commentAvatar} />
            <View style={styles.commentContent}>
                <Text style={styles.commentUsername}>{comment.user.fullName}</Text>
                <Text style={styles.commentText}>{comment.content}</Text>
                <Text style={styles.commentTime}>
                    {formatDistanceToNow(comment._creationTime, { addSuffix: true })}
                </Text>
            </View>
        </View>
    );
}
