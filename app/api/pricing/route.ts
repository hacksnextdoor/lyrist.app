import {NextResponse} from 'next/server';
import type {Stripe} from 'stripe';

const {STRIPE_SECRET_KEY} = process.env;

export async function GET() {
  const pricesResponse = await fetch('https://api.stripe.com/v1/prices', {
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  const productsResponse = await fetch('https://api.stripe.com/v1/products', {
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  const prices: Stripe.ApiList<Stripe.Price> = await pricesResponse.json();
  const products: Stripe.ApiList<Stripe.Product> = await productsResponse.json();
  const consolidatedArray = prices.data.reduce(
    (result: {price: Stripe.Price; product: Stripe.Product}[], currentPrice) => {
      if (!currentPrice.active) {
        return result;
      }
      const matchingProduct = products.data.find(
        item2 => item2 && item2.id === currentPrice.product,
      );
      if (matchingProduct) {
        result.push({price: currentPrice, product: matchingProduct});
      }
      return result;
    },
    [],
  );

  return NextResponse.json(consolidatedArray);
}
