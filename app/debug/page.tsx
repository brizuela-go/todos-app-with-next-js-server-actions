"use client";

import Link from "next/link";

import {
  resetServiceWorker,
  unregisterServiceWorkers,
} from "@/utils/serviceWorker";
import { Button } from "@/components/ui/button";

export default function DebugActions() {
  return (
    <div className="flex justify-center items-center h-screen flex-col">
      <h3 className={"text-center mt-8 text-2xl"}>Debug actions</h3>
      <div className={"flex justify-center gap-x-6 mt-12"}>
        <Button variant={"default"} onClick={resetServiceWorker}>
          Reset SW
        </Button>
        <Button onClick={unregisterServiceWorkers} variant={"secondary"}>
          Remove SW
        </Button>
      </div>
      <Link className="flex justify-center items-center mt-8" href="/">
        Back to home
      </Link>
    </div>
  );
}
