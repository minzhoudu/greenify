import { v } from 'convex/values';
import { mutation } from './_generated/server';

export const generateUploadUrl = mutation(async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');

    return await ctx.storage.generateUploadUrl();
});

export const createPost = mutation({
    args: {
        caption: v.optional(v.string()),
        storageId: v.id('_storage'),
    },

    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error('Unauthorized');

        const currentUser = await ctx.db
            .query('users')
            .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
            .first();

        if (!currentUser) throw new Error('User not found');

        const imageUrl = await ctx.storage.getUrl(args.storageId);

        if (!imageUrl) throw new Error('Image not found');

        const postId = await ctx.db.insert('posts', {
            ...args,
            userId: currentUser._id,
            imageUrl,
            likes: 0,
            comments: 0,
        });

        // increment the user's post count
        await ctx.db.patch(currentUser._id, {
            posts: currentUser.posts + 1,
        });

        return postId;
    },
});
