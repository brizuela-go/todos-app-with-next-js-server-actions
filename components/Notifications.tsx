"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { resetServiceWorker } from "@/utils/serviceWorker";
import { Notice } from "@/components/Notice";
import { Button } from "./ui/button";
import toast from "react-hot-toast";

const notificationsSupported = () =>
  "Notification" in window &&
  "serviceWorker" in navigator &&
  "PushManager" in window;

export default function Notifications() {
  const [permission, setPermission] = useState(
    window?.Notification?.permission || "default"
  );

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  if (!notificationsSupported()) {
    return (
      <Notice message="Please install this app on your home screen first!" />
    );
  }

  const requestPermission = async () => {
    if (!notificationsSupported()) {
      return;
    }

    const receivedPermission = await window?.Notification.requestPermission();
    setPermission(receivedPermission);

    if (receivedPermission === "granted") {
      subscribe();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen space-y-4">
      <Notice message={`Notifications permission status: ${permission}`} />
      <Button onClick={requestPermission} className={""}>
        Request permission and subscribe
      </Button>
      <Link href="/debug">Debug options</Link>
    </div>
  );
}

const saveSubscription = async (subscription: PushSubscription) => {
  const ORIGIN = window.location.origin;
  const BACKEND_URL = `${ORIGIN}/api/push`;

  const response = await fetch(BACKEND_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscription),
  });
  return response.json();
};

const subscribe = async () => {
  const swRegistration = await resetServiceWorker();

  try {
    const options = {
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      userVisibleOnly: true,
    };
    const subscription = await swRegistration.pushManager.subscribe(options);

    await saveSubscription(subscription);

    toast.success("Subscribed to notifications");

    // console.log({ subscription });
  } catch (err) {
    // console.error("Error", err);
    toast.error("Error subscribing to notifications");
  }
};
