import { mutation, MutationCtx, query, QueryCtx } from './_generated/server';
import { ConvexError, v } from 'convex/values';

export const createUser = mutation({
    args: {
        username: v.string(),
        fullName: v.string(),
        image: v.string(),
        bio: v.optional(v.string()),
        email: v.string(),
        clerkId: v.string(),
    },

    handler: async (ctx, args) => {
        const existingUser = await ctx.db
            .query('users')
            .withIndex('by_clerk_id', (query) => query.eq('clerkId', args.clerkId))
            .first();

        if (existingUser) return;

        await ctx.db.insert('users', {
            ...args,
            followers: 0,
            following: 0,
            posts: 0,
        });
    },
});

export const getAuthenticatedUser = async (ctx: QueryCtx | MutationCtx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');

    const currentUser = await ctx.db
        .query('users')
        .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
        .first();

    if (!currentUser) throw new Error('User not found');

    return currentUser;
};

export const getUserByClerkId = query({
    args: {
        clerkId: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query('users')
            .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId))
            .unique();

        if (!user) throw new ConvexError('User not found');

        return user;
    },
});
