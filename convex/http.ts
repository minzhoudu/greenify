import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { api } from './_generated/api';
import { Webhook } from 'svix';

const http = httpRouter();

http.route({
    path: '/clerk-webhook',
    method: 'POST',
    handler: httpAction(async (ctx, req) => {
        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

        if (!webhookSecret) {
            throw new Error('Missing CLERK_WEBHOOK_SECRET environment variable');
        }

        // Checking headers
        const svix_id = req.headers.get('svix-id');
        const svix_signature = req.headers.get('svix-signature');
        const svix_timestamp = req.headers.get('svix-timestamp');

        if (!svix_id || !svix_signature || !svix_timestamp) {
            return new Response('Error occured -- no svix headers', { status: 400 });
        }

        const payload = await req.json();
        const body = JSON.stringify(payload);

        const wh = new Webhook(webhookSecret);
        let event: any;

        // Verifying the webhook
        try {
            event = wh.verify(body, {
                'svix-id': svix_id,
                'svix-timestamp': svix_timestamp,
                'svix-signature': svix_signature,
            }) as any;
        } catch (error) {
            console.error('Webhook verification failed', error);
            return new Response('Error occured -- webhook verification failed', { status: 400 });
        }

        const eventType = event.type;

        if (eventType === 'user.created') {
            const { id, email_addresses, first_name, last_name, image_url } = event.data;

            const email = email_addresses[0].email_address;
            const fullName = `${first_name || ''} ${last_name || ''}`.trim();

            const username = email.split('@')[0];

            try {
                await ctx.runMutation(api.users.createUser, {
                    email,
                    fullName,
                    username,
                    image: image_url,
                    clerkId: id,
                });
            } catch (error) {
                console.error('Error creating user', error);
                return new Response('Error creating user', { status: 500 });
            }
        }

        return new Response('Event type not handled', { status: 200 });
    }),
});

export default http;
