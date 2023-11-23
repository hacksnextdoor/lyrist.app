import {NextRequest, NextResponse} from 'next/server';

/**
 * Check for a plus subscription purchased on stripe
 * https://www.revenuecat.com/reference/subscribers
 */
export async function GET(_, {params}) {
  const url = `https://api.revenuecat.com/v1/subscribers/${params.id}`;
  const apiKey = process.env.PURCHASES_API_KEY_WEB;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
  });
  const json = await response.json();
  let hasPlus = false;
  if (
    json.subscriber?.entitlements?.plus &&
    Object.keys(json.subscriber.entitlements.plus).length > 0
  ) {
    hasPlus = true;
  }
  return NextResponse.json(hasPlus);
}
