"use client";

import { createCheckoutSession } from "@/actions/actions";
import H1 from "@/components/h1";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [isPending, startTransition] = useTransition();
  const { data: session, update, status } = useSession();
  const router = useRouter();

  return (
    <main className="flex flex-col items-center space-y-10">
      <H1>PetSoft access require payment</H1>

      {searchParams.success && (
        <Button
          disabled={status === "loading" || session?.user.hasAccess}
          onClick={async () => {
            await update(true);
            router.push("/app/dashboard");
          }}
        >
          Access PetSoft
        </Button>
      )}

      {!searchParams.success && (
        <Button
          disabled={isPending}
          onClick={async () => {
            startTransition(async () => {
              await createCheckoutSession();
            });
          }}
        >
          Buy lifetime access for $299
        </Button>
      )}

      {searchParams.success && (
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold text-green-700">
            Payment successful
          </h2>
          <p className="text-green-700">Thank you for your purchase!</p>
        </div>
      )}

      {searchParams.cancelled && (
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold text-red-700">Payment failed</h2>
          <p className="text-red-700">Please try again</p>
        </div>
      )}
    </main>
  );
}
