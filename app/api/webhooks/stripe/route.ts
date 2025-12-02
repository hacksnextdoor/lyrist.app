import type {Stripe} from 'stripe';

import {NextResponse} from 'next/server';

import {stripe} from 'lib/stripe';

export async function POST(req: Request) {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      await (await req.blob()).text(),
      req.headers.get('stripe-signature') as string,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    // On error, log and return the error message.
    if (err! instanceof Error) console.log(err);
    console.log(`❌ Error message: ${errorMessage}`);
    return NextResponse.json({message: `Webhook Error: ${errorMessage}`}, {status: 400});
  }

  // Successfully constructed event.
  console.log('✅ Success:', event.id);

  const permittedEvents: string[] = [
    'checkout.session.completed',
    'payment_intent.succeeded',
    'payment_intent.payment_failed',
  ];

  if (permittedEvents.includes(event.type)) {
    let data;

    try {
      switch (event.type) {
        case 'checkout.session.completed':
          // The user paid successfully and the subscription is created (if any)
          // Provision access to your service
          // case "invoice paid":/
          // A payment was made, usually a recurring payments for a subscription
          // Provision access to your service
          data = event.data.object as Stripe.Checkout.Session;
          const apiKey = process.env.NEXT_PUBLIC_PURCHASES_API_KEY_WEB;
          const apiUrl = 'https://api.revenuecat.com/v1/receipts';
          const requestData = {
            app_user_id: data.metadata.userId,
            fetch_token: data.subscription ?? data.id,
          };
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Platform': 'stripe',
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify(requestData),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const json = await response.json();
          console.log(`Response.json: ${JSON.stringify(json)}`);
          console.log(`💰 CheckoutSession status: ${data.payment_status}`);
          break;
        case 'payment_intent.payment_failed':
          data = event.data.object as Stripe.PaymentIntent;
          console.log(`❌ Payment failed: ${data.last_payment_error?.message}`);
          break;
        case 'payment_intent.succeeded':
          data = event.data.object as Stripe.PaymentIntent;
          console.log(`💰 PaymentIntent status: ${data.status} ${JSON.stringify(data)}`);
          break;
        // case "checkout.session.expired":
        // The user didn't complete the transaction
        // (optional) Send an abandoned cart email
        // case "invoice.payment_failed":
        // A payment failed, usually a recurring payment for a subscription
        // Revoke access to your service
        // OR send email to user to pay/update payment method
        // and wait for 'customer.subscription.deleted' event to revoke access
        // case "customer.subscription.deleted":
        // The subscription was canceled
        // X Revoke access to your service
        default:
        // throw new Error(`Unhandled event: ${event.type}`);
      }
    } catch (error) {
      return NextResponse.json(
        {message: `Webhook handler failed: ${error.message}`},
        {status: 500},
      );
    }
  }

  // Return a response to acknowledge receipt of the event.
  return NextResponse.json({message: 'Received'}, {status: 200});
}
