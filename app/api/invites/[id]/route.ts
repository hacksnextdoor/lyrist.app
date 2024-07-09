import {NextResponse} from 'next/server';

/**
 * API reference
 * https://www.revenuecat.com/docs/api-v1#tag/customers/operation/update-subscriber-attributes
 */

export async function GET(_, {params}) {
  const url = `https://api.revenuecat.com/v1/subscribers/${params.id}`;
  const apiKey = process.env.PURCHASES_SECRET_API_KEY;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    cache: 'no-cache',
  });
  if (response.status >= 200 && response.status <= 299) {
    const json = await response.json();
    if (!json) {
      return NextResponse.json(['no json for some reason']);
    }
    if (!json.subscriber) {
      return NextResponse.json(['no subscriber for some reason']);
    }
    if (!json.subscriber.subscriber_attributes) {
      return NextResponse.json(['no subscriber for some reason']);
    }
    let invites: string[] = [];
    if (json.subscriber.subscriber_attributes.invites?.value) {
      invites = JSON.parse(json.subscriber.subscriber_attributes.invites.value);
    }
    return NextResponse.json(invites);
  }
  return NextResponse.json([response]);
}
