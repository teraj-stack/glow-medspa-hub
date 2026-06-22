const clientToken = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN as string | undefined;

export function PaymentTestModeBanner() {
  if (!clientToken) {
    return (
      <div className="w-full border-b border-red-300 bg-red-100 px-4 py-2 text-center text-sm text-red-800">
        Płatności produkcyjne nie są jeszcze skonfigurowane. Dokończ go-live Stripe w panelu Lovable.
      </div>
    );
  }
  if (clientToken.startsWith("pk_test_")) {
    return (
      <div className="w-full border-b border-orange-300 bg-orange-100 px-4 py-2 text-center text-sm text-orange-800">
        Wszystkie płatności w podglądzie są w trybie testowym. Użyj karty 4242 4242 4242 4242.
      </div>
    );
  }
  return null;
}
