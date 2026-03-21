import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { adminApi } from "../../lib/api";
import { AdminPageShell } from "../../components/admin/admin-page-shell";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { FormField } from "../../components/ui/form-field";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { SiteSetting } from "../../types";

const schema = z.object({
  siteTitle: z.string().min(2),
  siteTitleVi: z.string().optional(),
  siteDescription: z.string().min(10),
  siteDescriptionVi: z.string().optional(),
  faviconUrl: z.string().optional(),
  footerText: z.string().optional(),
  footerTextVi: z.string().optional(),
  primaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  enableDarkMode: z.boolean()
});

type FormValues = z.infer<typeof schema>;

export const SettingsPage = () => {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const response = await adminApi.get<{ data: SiteSetting | null }>("/settings");
      return response.data.data;
    }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: {
      siteTitle: data?.siteTitle || "",
      siteTitleVi: data?.siteTitleVi || "",
      siteDescription: data?.siteDescription || "",
      siteDescriptionVi: data?.siteDescriptionVi || "",
      faviconUrl: data?.faviconUrl || "",
      footerText: data?.footerText || "",
      footerTextVi: data?.footerTextVi || "",
      primaryColor: data?.primaryColor || "#0f172a",
      accentColor: data?.accentColor || "#14b8a6",
      enableDarkMode: data?.enableDarkMode ?? true
    }
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => adminApi.put("/settings", values),
    onSuccess: async () => {
      toast.success("Settings saved");
      await queryClient.invalidateQueries({ queryKey: ["settings"] });
      await queryClient.invalidateQueries({ queryKey: ["public-data"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to save settings");
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = form;

  return (
    <AdminPageShell title="Settings" description="Control SEO basics, favicon, footer text, and overall site preferences.">
      <Card>
        <form className="grid gap-5 lg:grid-cols-2" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
          <FormField label="Site title" error={errors.siteTitle?.message}>
            <Input {...register("siteTitle")} />
          </FormField>
          <FormField label="Site title (VI)">
            <Input {...register("siteTitleVi")} />
          </FormField>
          <FormField label="Favicon URL">
            <Input {...register("faviconUrl")} />
          </FormField>
          <div className="lg:col-span-2">
            <FormField label="Site description" error={errors.siteDescription?.message}>
              <Textarea {...register("siteDescription")} />
            </FormField>
          </div>
          <div className="lg:col-span-2">
            <FormField label="Site description (VI)">
              <Textarea {...register("siteDescriptionVi")} />
            </FormField>
          </div>
          <div className="lg:col-span-2">
            <FormField label="Footer text">
              <Textarea {...register("footerText")} />
            </FormField>
          </div>
          <div className="lg:col-span-2">
            <FormField label="Footer text (VI)">
              <Textarea {...register("footerTextVi")} />
            </FormField>
          </div>
          <FormField label="Primary color">
            <Input {...register("primaryColor")} />
          </FormField>
          <FormField label="Accent color">
            <Input {...register("accentColor")} />
          </FormField>
          <label className="inline-flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300 lg:col-span-2">
            <input type="checkbox" className="h-4 w-4 rounded border-slate-300" {...register("enableDarkMode")} />
            Enable dark mode toggle on public site
          </label>
          <div className="lg:col-span-2">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Save settings"}
            </Button>
          </div>
        </form>
      </Card>
    </AdminPageShell>
  );
};
