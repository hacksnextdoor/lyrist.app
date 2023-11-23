'use server';

import type {Stripe} from 'stripe';

import {redirect} from 'next/navigation';
import {headers} from 'next/headers';

import {stripe} from '../../utils/stripe';

export default async function createCheckoutSession(
  lineItem: Stripe.Checkout.SessionCreateParams.LineItem,
  recurring: Stripe.Price.Recurring,
  userId: string,
  userEmail: string,
) {
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: recurring ? 'subscription' : 'payment',
    line_items: [lineItem],
    metadata: {userId},
    subscription_data: headers().get('origin')?.includes('localhost')
      ? {}
      : recurring && recurring.interval === 'month'
      ? {trial_period_days: 7}
      : recurring && recurring.interval === 'year'
      ? {trial_period_days: 30}
      : {},
    success_url: `${headers().get('origin')}/pricing/result?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${headers().get('origin')}/pricing`,
    customer_email: userEmail,
  });

  redirect(checkoutSession.url as string);
}
