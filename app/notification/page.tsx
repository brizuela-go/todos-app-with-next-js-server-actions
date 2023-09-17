import dynamic from "next/dynamic";

const Notifications = dynamic(() => import("@/components/Notifications"), {
  ssr: false, // Make sure to render component client side to access window and Notification API's
});

export default function Home() {
  return <Notifications />;
}
