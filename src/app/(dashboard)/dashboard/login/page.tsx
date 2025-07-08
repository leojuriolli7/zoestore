"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toastError } from "@/query/core/toastError";
import { Eye, EyeOff, Lock } from "lucide-react";
import {
  LoginWithAdminKeySchema,
  loginWithAdminKeySchema,
} from "@/query/authentication/loginWithAdminKey/schema";
import { loginWithAdminKeyOptions } from "@/query/authentication/loginWithAdminKey/mutation";
import Image from "next/image";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginWithAdminKeySchema>({
    resolver: zodResolver(loginWithAdminKeySchema),
    defaultValues: { password: "" },
  });

  const { mutateAsync: sendPassword } = useMutation(loginWithAdminKeyOptions());

  const [checkingPassword, setCheckingPassword] = useState(false);

  const onSubmit = async (data: LoginWithAdminKeySchema) => {
    // We set this manually instead of using `isPending` or `formState.isSubmitting`
    // because we want the loading to persist until the user is redirected to the dashboard.
    setCheckingPassword(true);

    try {
      const { success } = await sendPassword(data);

      if (success === true) {
        router.replace("/dashboard");
      }
    } catch (error) {
      setCheckingPassword(false);
      toastError(error);
    }
  };

  return (
    <div className="h-[100dvh] w-screen flex items-center justify-center bg-muted/50 p-4">
      <Card className="md:full max-w-4xl md:grid md:grid-cols-2 shadow-xl rounded-lg overflow-hidden py-0 bg-background">
        <div className="hidden md:block relative min-h-[500px]">
          <Image
            src="/center_both.jpg"
            alt="ZOE Store - Modelo com sacolas de compras"
            fill
            className="object-cover object-top"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 text-white">
            <h1 className="text-4xl font-bold mb-2 drop-shadow-lg">
              ZOE STORE
            </h1>
            <p className="text-lg opacity-90 drop-shadow-md">
              Peças que vestem elegância
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-8 lg:p-12 bg-background">
          <div className="w-full max-w-sm space-y-6">
            <div className="text-center">
              <CardTitle className="text-2xl font-bold">
                Acesso ao Dashboard
              </CardTitle>

              <CardDescription className="mt-1">
                Digite sua senha para acessar o painel administrativo
              </CardDescription>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="password" className="text-sm font-medium">
                        Senha
                      </Label>

                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />

                        <FormControl>
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Digite sua senha"
                            className="pl-10 pr-10"
                            required
                            {...field}
                          />
                        </FormControl>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}

                          <span className="sr-only">
                            {showPassword ? "Ocultar senha" : "Mostrar senha"}
                          </span>
                        </Button>
                      </div>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  loading={checkingPassword}
                  disabled={checkingPassword}
                >
                  Entrar no Dashboard
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </Card>
    </div>
  );
}
