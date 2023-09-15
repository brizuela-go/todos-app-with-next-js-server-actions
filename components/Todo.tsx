"use client";

import { addTodo, deleteTodo, editTodo } from "@/server/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { useRef, useState } from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { experimental_useOptimistic as useOptimistic } from "react";
import toast from "react-hot-toast";

type Todo = {
  id: number;
  title: string;
  createdAt: Date;
};

type Props = {
  todos: Todo[];
};

const Todo = ({ todos }: Props) => {
  const ref = useRef<HTMLFormElement>(null);
  const { pending } = useFormStatus();
  const [editable, setEditable] = useState(false);
  const [title, setTitle] = useState("");
  const [editableTodoId, setEditableTodoId] = useState<number | null>(null);

  return (
    <>
      <form
        ref={ref}
        action={async (formData) => {
          ref.current?.reset();

          toast.promise(addTodo(formData), {
            loading: "Adding todo...",
            success: "Todo added!",
            error: (err) => err.message,
          });
        }}
        className="flex justify-center items-center gap-4 mt-8"
      >
        <Input className="" name="title" placeholder="Add a todo" />
        <Button type="submit" disabled={pending}>
          {pending ? "Adding..." : "Add"}
        </Button>
      </form>
      {todos.length === 0 && (
        <div className="flex justify-center items-center mt-20">
          <p className="text-lg text-secondary-foreground">No todos yet</p>
        </div>
      )}
      <ul className="container gap-6 grid grid-cols-1 md:grid-cols-4 mt-12">
        {todos.map((todo) => {
          const isEditing = todo.id === editableTodoId;

          return (
            <Card key={todo.id}>
              <CardHeader>
                <CardTitle>
                  {isEditing ? (
                    <Input
                      onChange={(e) => {
                        setTitle(e.target.value);
                      }}
                      name="title"
                      value={title}
                    />
                  ) : (
                    <>{todo.title}</>
                  )}
                </CardTitle>
                <CardDescription>
                  {todo?.createdAt.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardDescription>
              </CardHeader>
              <CardFooter className="space-x-6">
                {isEditing ? (
                  <Button
                    onClick={() => {
                      setEditableTodoId(null);
                      toast.promise(editTodo(todo.id, title), {
                        loading: "Editing todo...",
                        success: "Todo edited!",
                        error: (err) => err.message,
                      });
                    }}
                    variant={"secondary"}
                  >
                    <Pencil1Icon className="mr-2" />
                    Save
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setEditableTodoId(todo.id);
                      setTitle(todo.title);
                    }}
                    variant={"secondary"}
                  >
                    <Pencil1Icon className="mr-2" />
                    Edit
                  </Button>
                )}
                <Button
                  onClick={() => {
                    setEditable(false);
                    toast.promise(deleteTodo(todo.id), {
                      loading: "Completing Todo...",
                      success: "Todo completed!",
                      error: (err) => err.message,
                    });
                  }}
                >
                  <CheckIcon className="mr-2" />
                  Complete
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </ul>
    </>
  );
};

export default Todo;
