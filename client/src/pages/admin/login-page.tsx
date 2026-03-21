import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LockKeyhole } from "lucide-react";
import { adminApi } from "../../lib/api";
import { useAuth } from "../../contexts/auth-context";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { FormField } from "../../components/ui/form-field";
import { Input } from "../../components/ui/input";
import { LanguageToggle } from "../../components/ui/language-toggle";
import { AdminAuthResponse } from "../../types";
import { useLocale } from "../../contexts/locale-context";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

type FormValues = z.infer<typeof schema>;

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const { locale, toggleLocale, t } = useLocale();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "admin@example.com",
      password: "Admin@12345"
    }
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const response = await adminApi.post<{ data: AdminAuthResponse }>("/auth/login", values);
      return response.data.data;
    },
    onSuccess: (data) => {
      login(data);
      toast.success(t("Logged in successfully"));
      navigate(location.state?.from || "/admin/dashboard", { replace: true });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t("Login failed"));
    }
  });

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="container-shell flex min-h-screen items-center justify-center py-12">
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className="pixel-surface rounded-[2rem] bg-slate-950 p-10 text-white dark:bg-slate-950">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-300" style={{ fontFamily: '"Pixelify Sans", monospace' }}>{t("Admin Portal")}</p>
          <h1 className="mt-6 font-display text-5xl font-bold">{t("Shape every section of your portfolio from one clean dashboard.")}</h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-slate-300">
            {t("Manage personal info, projects, achievements, testimonials, contact links, and site settings with a focused fullstack CMS built for Render deployment.")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="pixel-chip">CMS</span>
            <span className="pixel-chip bg-amber-300">JWT</span>
            <span className="pixel-chip bg-lime-300">Prisma</span>
          </div>
        </div>

        <Card className="rounded-[2rem] p-8">
          <div className="mb-6 flex justify-end">
            <LanguageToggle locale={locale} onToggle={toggleLocale} />
          </div>
          <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500 text-white">
            <LockKeyhole className="h-6 w-6" />
          </div>
          <h2 className="font-display text-3xl font-bold text-slate-950 dark:text-white">{t("Admin Login")}</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {t("Sign in with your email and password to manage the portfolio.")}
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
            <FormField label={t("Email")} error={errors.email?.message}>
              <Input type="email" {...register("email")} />
            </FormField>
            <FormField label={t("Password")} error={errors.password?.message}>
              <Input type="password" {...register("password")} />
            </FormField>
            <Button className="w-full" type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? t("Signing in...") : t("Login to dashboard")}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
