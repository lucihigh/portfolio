import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { adminApi } from "../../lib/api";
import { AdminPageShell } from "../../components/admin/admin-page-shell";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { ConfirmDialog } from "../../components/ui/dialog";
import { FormField } from "../../components/ui/form-field";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Achievement } from "../../types";
import { toInputDate } from "../../lib/format";

const schema = z.object({
  title: z.string().min(2),
  titleVi: z.string().optional(),
  issuer: z.string().optional(),
  issuerVi: z.string().optional(),
  description: z.string().min(10),
  descriptionVi: z.string().optional(),
  date: z.string().optional(),
  imageUrl: z.string().optional(),
  credentialUrl: z.string().optional(),
  sortOrder: z.coerce.number().default(0),
  isPublished: z.boolean()
});

type FormValues = z.infer<typeof schema>;

const initialValues: FormValues = {
  title: "",
  titleVi: "",
  issuer: "",
  issuerVi: "",
  description: "",
  descriptionVi: "",
  date: "",
  imageUrl: "",
  credentialUrl: "",
  sortOrder: 0,
  isPublished: true
};

export const AchievementsPage = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Achievement | null>(null);
  const [deleting, setDeleting] = useState<Achievement | null>(null);

  const { data } = useQuery({
    queryKey: ["achievements"],
    queryFn: async () => {
      const response = await adminApi.get<{ data: Achievement[] }>("/achievements");
      return response.data.data;
    }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: editing
      ? {
          title: editing.title,
          titleVi: editing.titleVi || "",
          issuer: editing.issuer || "",
          issuerVi: editing.issuerVi || "",
          description: editing.description,
          descriptionVi: editing.descriptionVi || "",
          date: toInputDate(editing.date),
          imageUrl: editing.imageUrl || "",
          credentialUrl: editing.credentialUrl || "",
          sortOrder: editing.sortOrder,
          isPublished: editing.isPublished
        }
      : initialValues
  });

  const saveMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload = {
        ...values,
        titleVi: values.titleVi || undefined,
        issuerVi: values.issuerVi || undefined,
        descriptionVi: values.descriptionVi || undefined,
        date: values.date ? new Date(values.date).toISOString() : undefined
      };
      return editing
        ? adminApi.put(`/achievements/${editing.id}`, payload)
        : adminApi.post("/achievements", payload);
    },
    onSuccess: async () => {
      toast.success(editing ? "Achievement updated" : "Achievement created");
      setEditing(null);
      form.reset(initialValues);
      await queryClient.invalidateQueries({ queryKey: ["achievements"] });
      await queryClient.invalidateQueries({ queryKey: ["public-data"] });
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to save achievement")
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => adminApi.delete(`/achievements/${id}`),
    onSuccess: async () => {
      toast.success("Achievement deleted");
      setDeleting(null);
      await queryClient.invalidateQueries({ queryKey: ["achievements"] });
      await queryClient.invalidateQueries({ queryKey: ["public-data"] });
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to delete achievement")
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = form;

  return (
    <AdminPageShell title="Achievements" description="Highlight awards, finalist placements, and certificates with simple rich content.">
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
            {editing ? "Edit achievement" : "Add achievement"}
          </h2>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit((values) => saveMutation.mutate(values))}>
            <FormField label="Title" error={errors.title?.message}>
              <Input {...register("title")} />
            </FormField>
            <FormField label="Title (VI)">
              <Input {...register("titleVi")} />
            </FormField>
            <FormField label="Issuer">
              <Input {...register("issuer")} />
            </FormField>
            <FormField label="Issuer (VI)">
              <Input {...register("issuerVi")} />
            </FormField>
            <FormField label="Description" error={errors.description?.message}>
              <Textarea {...register("description")} />
            </FormField>
            <FormField label="Description (VI)">
              <Textarea {...register("descriptionVi")} />
            </FormField>
            <FormField label="Date">
              <Input type="date" {...register("date")} />
            </FormField>
            <FormField label="Image URL">
              <Input {...register("imageUrl")} />
            </FormField>
            <FormField label="Credential URL">
              <Input {...register("credentialUrl")} />
            </FormField>
            <FormField label="Sort order">
              <Input type="number" {...register("sortOrder")} />
            </FormField>
            <label className="inline-flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-300" {...register("isPublished")} />
              Publish this achievement
            </label>
            <div className="flex gap-3">
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Saving..." : editing ? "Update achievement" : "Create achievement"}
              </Button>
              {editing ? (
                <Button type="button" variant="outline" onClick={() => { setEditing(null); form.reset(initialValues); }}>
                  Cancel
                </Button>
              ) : null}
            </div>
          </form>
        </Card>

        <div className="space-y-4">
          {data?.map((achievement) => (
            <Card key={achievement.id}>
              <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600">{achievement.issuer || "Achievement"}</p>
                  <h3 className="mt-2 font-display text-2xl font-bold text-slate-950 dark:text-white">{achievement.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{achievement.description}</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setEditing(achievement)}>Edit</Button>
                  <Button variant="destructive" onClick={() => setDeleting(achievement)}>Delete</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete achievement?"
        description={`This will permanently remove "${deleting?.title}".`}
        onCancel={() => setDeleting(null)}
        onConfirm={() => deleting && deleteMutation.mutate(deleting.id)}
      />
    </AdminPageShell>
  );
};
