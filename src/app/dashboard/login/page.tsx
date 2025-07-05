"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { $fetch } from "@/lib/fetch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const schema = z.object({
  password: z.string().min(1, "Senha é obrigatória"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: "" },
  });

  const { mutateAsync: sendPassword, isPending: checkingPassword } =
    useMutation({
      mutationFn: (data: FormValues) =>
        $fetch<{ success: boolean }>("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }),
    });

  const onSubmit = async (data: FormValues) => {
    try {
      const { success } = await sendPassword(data);

      if (success === true) {
        router.replace("/dashboard");
      }
    } catch (error) {
      const e = error as { message: string };
      toast.error(e.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm p-8 rounded-lg shadow bg-white dark:bg-zinc-900">
        <h1 className="text-2xl font-bold mb-6 text-center">
          ZOE | Entrar na Dashboard de Produtos
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Digite a senha..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" loading={checkingPassword}>
              Entrar
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
