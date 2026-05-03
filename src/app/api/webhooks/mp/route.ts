import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const params = Object.fromEntries(request.nextUrl.searchParams);

    const topic = params.topic;
    const id = params.id;

    if (!topic || !id) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    if (topic === "payment") {
      const paymentResponse = await fetch(
        `https://api.mercadopago.com/v1/payments/${id}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          },
        }
      );

      const payment = await paymentResponse.json();

      if (payment.status === "approved") {
        const externalRef = payment.external_reference;

        if (externalRef) {
          await fetch(
            `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/mutation?functionName=appointments:markDepositPaid`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                args: {
                  id: externalRef,
                  mpPaymentId: payment.id.toString(),
                },
              }),
            }
          );
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("MP webhook error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
