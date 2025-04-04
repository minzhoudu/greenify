import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getAuthenticatedUser } from './users';

export const toggleBookmark = mutation({
    args: {
        postId: v.id('posts'),
    },
    handler: async (ctx, args) => {
        const currentUser = await getAuthenticatedUser(ctx);

        const isBookmarked = await ctx.db
            .query('bookmarks')
            .withIndex('by_user_and_post', (q) =>
                q.eq('userId', currentUser._id).eq('postId', args.postId),
            )
            .first();

        if (isBookmarked) {
            await ctx.db.delete(isBookmarked._id);

            return false;
        }

        await ctx.db.insert('bookmarks', {
            userId: currentUser._id,
            postId: args.postId,
        });

        return true;
    },
});

export const getBookmarks = query({
    args: {
        userId: v.id('users'),
    },
    handler: async (ctx, args) => {
        const currentUser = await getAuthenticatedUser(ctx);

        const bookmarks = await ctx.db
            .query('bookmarks')
            .withIndex('by_user', (q) => q.eq('userId', currentUser._id))
            .collect();

        return await Promise.all(
            bookmarks.map(async (bookmark) => {
                return await ctx.db.get(bookmark.postId);
            }),
        );
    },
});
