const MP_API = "https://api.mercadopago.com";

function getHeaders() {
  return {
    Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  };
}

export async function createCheckoutPreference({
  items,
  externalReference,
  notificationUrl,
  backUrls,
}: {
  items: Array<{ title: string; quantity: number; unit_price: number; currency_id: string }>;
  externalReference: string;
  notificationUrl?: string;
  backUrls?: Record<string, string>;
}) {
  const response = await fetch(`${MP_API}/checkout/preferences`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      items,
      external_reference: externalReference,
      notification_url: notificationUrl,
      back_urls: backUrls,
      auto_return: "all",
      payment_methods: {
        excluded_payment_types: [],
        installments: 1,
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`MP error: ${JSON.stringify(data)}`);
  }

  return {
    id: data.id,
    initPoint: data.init_point || data.sandbox_init_point,
  };
}

export async function getPaymentInfo(paymentId: string) {
  const response = await fetch(
    `${MP_API}/v1/payments/${paymentId}`,
    { headers: getHeaders() }
  );
  return response.json();
}
