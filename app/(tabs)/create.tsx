import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Image } from 'expo-image';

import { COLORS } from '@/constants/theme';
import { styles } from '@/styles/create.styles';

export default function CreateScreen() {
    const router = useRouter();
    const { user } = useUser();
    const [caption, setCaption] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) setSelectedImage(result.assets[0].uri);
    };

    const handleShare = async () => {};

    if (!selectedImage) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>New Post</Text>
                    <View style={{ width: 28 }} />
                </View>

                <TouchableOpacity style={styles.emptyImageContainer} onPress={pickImage}>
                    <Ionicons name="image-outline" size={48} color={COLORS.gray} />
                    <Text style={styles.emptyImageText}>Tap to select an image</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => {
                            setSelectedImage(null);
                            setCaption('');
                        }}
                        disabled={isUploading}
                    >
                        <Ionicons
                            name="close-outline"
                            size={28}
                            color={isUploading ? COLORS.gray : COLORS.white}
                        />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>New Post</Text>

                    <TouchableOpacity
                        style={[styles.shareButton, isUploading && styles.shareButtonDisabled]}
                        disabled={isUploading || !selectedImage}
                        onPress={handleShare}
                    >
                        {isUploading ? (
                            <ActivityIndicator size="small" color={COLORS.primary} />
                        ) : (
                            <Text style={styles.shareText}>Share</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    bounces={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={[styles.content, isUploading && styles.contentDisabled]}>
                        <View style={styles.imageSection}>
                            <Image
                                source={selectedImage}
                                style={styles.previewImage}
                                contentFit="cover"
                                transition={200}
                            />
                            <TouchableOpacity
                                style={styles.changeImageButton}
                                onPress={pickImage}
                                disabled={isUploading}
                            >
                                <Ionicons name="image-outline" size={20} color={COLORS.white} />
                                <Text style={styles.changeImageText}>Change</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputSection}>
                            <View style={styles.captionContainer}>
                                <Image
                                    source={user?.imageUrl}
                                    style={styles.userAvatar}
                                    contentFit="cover"
                                    transition={200}
                                />

                                <TextInput
                                    style={styles.captionInput}
                                    placeholder="Write a caption..."
                                    placeholderTextColor={COLORS.gray}
                                    multiline
                                    value={caption}
                                    onChangeText={setCaption}
                                    editable={!isUploading}
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
}
