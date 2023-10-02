import Todo from "@/components/Todo";
import prisma from "@/prisma/client";
import Link from "next/link";

export default async function Home() {
  const todos = await prisma.todo.findMany();

  return (
    <main className="flex flex-col justify-center mt-28 items-center">
      <div>
        <h1 className="text-7xl font-bold text-foreground mt-4 tracking-tighter ">
          Todo App
        </h1>
      </div>
      <p className="text-xl text-muted-foreground tracking-tight mt-6">
        With server actions
      </p>
      <Todo todos={todos} />
      <Link
        className="fixed bottom-7 right-7 bg-slate-200 p-2"
        href="/notification"
      >
        Notifications :D
      </Link>
    </main>
  );
}
