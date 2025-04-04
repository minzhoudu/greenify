import { COLORS } from '@/constants/theme';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { styles } from '@/styles/feed.styles';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery } from 'convex/react';
import React, { useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Loader from '../loader/Loader';
import Comment from './Comment';

type CommentsModalProps = {
    postId: Id<'posts'>;
    open: boolean;
    onCommentAdded: () => void;
    onClose: () => void;
};

export default function CommentsModal({
    postId,
    open,
    onCommentAdded,
    onClose,
}: CommentsModalProps) {
    const [newComment, setNewComment] = useState('');

    const comments = useQuery(api.comments.getComments, { postId });
    const addComment = useMutation(api.comments.addComment);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            await addComment({ postId, content: newComment });
            setNewComment('');
            onCommentAdded();
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    return (
        <Modal visible={open} onRequestClose={onClose} animationType="slide" transparent>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalContainer}
            >
                <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={24} color={COLORS.white} />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Comments</Text>
                    <View style={{ width: 24 }} />
                </View>

                {comments === undefined ? (
                    <Loader />
                ) : (
                    <FlatList
                        data={comments}
                        renderItem={({ item }) => <Comment comment={item} />}
                        keyExtractor={(item) => item._id}
                    />
                )}

                <View style={styles.commentInput}>
                    <TextInput
                        style={styles.input}
                        placeholder="Add a comment..."
                        placeholderTextColor={COLORS.gray}
                        value={newComment}
                        onChangeText={setNewComment}
                        multiline
                    />

                    <TouchableOpacity onPress={handleAddComment} disabled={!newComment.trim()}>
                        <Text
                            style={[
                                styles.postButton,
                                !newComment.trim() && styles.postButtonDisabled,
                            ]}
                        >
                            Post
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}
