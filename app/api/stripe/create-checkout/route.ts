import {NextRequest, NextResponse} from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

export async function POST(req: NextRequest) {
  try {
    const {priceId, uid} = await req.json();

    if (!priceId || !uid) {
      return NextResponse.json({error: 'Missing priceId or uid'}, {status: 400});
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
      metadata: {
        userId: uid,
      },
    });

    return NextResponse.json({url: session.url});
  } catch (error: any) {
    return NextResponse.json({error: error.message}, {status: 500});
  }
}
