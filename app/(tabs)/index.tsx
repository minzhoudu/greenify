import { api } from '@/convex/_generated/api';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import { FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import Loader from '@/components/loader/Loader';
import NoPostsFound from '@/components/post/NoPostsFound';
import { STORIES } from '@/components/story/mock-data';
import Story from '@/components/story/Story';
import { COLORS } from '@/constants/theme';
import { styles } from '@/styles/feed.styles';
import Post from '@/components/post/Post';
import StoriesSection from '@/components/story/StoriesSection';

export default function Index() {
    const { signOut } = useAuth();

    const posts = useQuery(api.posts.getFeedPosts);

    if (posts === undefined) {
        return <Loader />;
    }

    if (posts.length === 0) {
        return <NoPostsFound />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Greenify</Text>
                <TouchableOpacity onPress={() => signOut()}>
                    <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={posts}
                renderItem={({ item }) => <Post post={item} />}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 60 }}
                ListHeaderComponent={<StoriesSection />}
            />
        </View>
    );
}
