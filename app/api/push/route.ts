import { NextResponse, NextRequest } from "next/server";
import { getSubscriptionsFromDb, saveSubscriptionToDb } from "@/utils/db";
import webpush, { PushSubscription } from "web-push";

webpush.setVapidDetails(
  "mailto:juanbrizuela@gmail.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string,
  process.env.VAPID_PRIVATE_KEY as string
);

export async function POST(request: NextRequest) {
  const subscription = (await request.json()) as PushSubscription | null;

  if (!subscription) {
    console.error("No subscription was provided!");
    return;
  }

  const updatedDb = await saveSubscriptionToDb(subscription);

  return NextResponse.json({ message: "success", updatedDb });
}

export async function GET(_: NextRequest) {
  const subscriptions = await getSubscriptionsFromDb();

  subscriptions.forEach((s) => {
    const payload = JSON.stringify({
      title: "WebPush Notification!",
      body: "Hello World",
    });
    webpush.sendNotification(s, payload);
  });

  return NextResponse.json({
    message: `${subscriptions.length} messages sent!`,
  });
}
