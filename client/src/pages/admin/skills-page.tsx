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
import { useLocale } from "../../contexts/locale-context";
import { Skill } from "../../types";

const schema = z.object({
  name: z.string().min(1),
  nameVi: z.string().optional(),
  category: z.string().min(1),
  categoryVi: z.string().optional(),
  level: z.string().optional(),
  levelVi: z.string().optional(),
  description: z.string().optional(),
  descriptionVi: z.string().optional(),
  icon: z.string().optional(),
  sortOrder: z.coerce.number().default(0),
  isPublished: z.boolean()
});

type FormValues = z.infer<typeof schema>;

const initialValues: FormValues = {
  name: "",
  nameVi: "",
  category: "Frontend",
  categoryVi: "",
  level: "",
  levelVi: "",
  description: "",
  descriptionVi: "",
  icon: "",
  sortOrder: 0,
  isPublished: true
};

export const SkillsPage = () => {
  const { t } = useLocale();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Skill | null>(null);
  const [deleting, setDeleting] = useState<Skill | null>(null);

  const { data } = useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const response = await adminApi.get<{ data: Skill[] }>("/skills");
      return response.data.data;
    }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: editing
      ? {
          name: editing.name,
          nameVi: editing.nameVi || "",
          category: editing.category,
          categoryVi: editing.categoryVi || "",
          level: editing.level || "",
          levelVi: editing.levelVi || "",
          description: editing.description || "",
          descriptionVi: editing.descriptionVi || "",
          icon: editing.icon || "",
          sortOrder: editing.sortOrder,
          isPublished: editing.isPublished
        }
      : initialValues
  });

  const saveMutation = useMutation({
    mutationFn: async (values: FormValues) =>
      editing
        ? adminApi.put(`/skills/${editing.id}`, values)
        : adminApi.post("/skills", values),
    onSuccess: async () => {
      toast.success(editing ? t("Update skill") : t("Create skill"));
      setEditing(null);
      form.reset(initialValues);
      await queryClient.invalidateQueries({ queryKey: ["skills"] });
      await queryClient.invalidateQueries({ queryKey: ["public-data"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to save skill");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => adminApi.delete(`/skills/${id}`),
    onSuccess: async () => {
      toast.success(t("Delete"));
      setDeleting(null);
      await queryClient.invalidateQueries({ queryKey: ["skills"] });
      await queryClient.invalidateQueries({ queryKey: ["public-data"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete skill");
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = form;

  return (
    <AdminPageShell title={t("Skills")} description={t("Group your capabilities by category and keep the public site up to date.")}>
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
            {editing ? t("Edit skill") : t("Add skill")}
          </h2>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit((values) => saveMutation.mutate(values))}>
            <FormField label={t("Skill name")} error={errors.name?.message}>
              <Input {...register("name")} />
            </FormField>
            <FormField label={`${t("Skill name")} (VI)`}>
              <Input {...register("nameVi")} />
            </FormField>
            <FormField label={t("Category")} error={errors.category?.message}>
              <Input {...register("category")} />
            </FormField>
            <FormField label={`${t("Category")} (VI)`}>
              <Input {...register("categoryVi")} />
            </FormField>
            <FormField label={t("Level")}>
              <Input {...register("level")} />
            </FormField>
            <FormField label={`${t("Level")} (VI)`}>
              <Input {...register("levelVi")} />
            </FormField>
            <FormField label={t("Description")}>
              <Input {...register("description")} />
            </FormField>
            <FormField label={`${t("Description")} (VI)`}>
              <Input {...register("descriptionVi")} />
            </FormField>
            <FormField label={t("Icon key")}>
              <Input {...register("icon")} />
            </FormField>
            <FormField label={t("Sort order")}>
              <Input type="number" {...register("sortOrder")} />
            </FormField>
            <label className="inline-flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-300" {...register("isPublished")} />
              {t("Publish this skill")}
            </label>
            <div className="flex gap-3">
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? t("Saving...") : editing ? t("Update skill") : t("Create skill")}
              </Button>
              {editing ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditing(null);
                    form.reset(initialValues);
                  }}
                >
                  {t("Cancel")}
                </Button>
              ) : null}
            </div>
          </form>
        </Card>

        <div className="space-y-4">
          {data?.map((skill) => (
            <Card key={skill.id}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600">{skill.category}</p>
                  <h3 className="mt-2 font-display text-2xl font-bold text-slate-950 dark:text-white">{skill.name}</h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{skill.level || "No level set"}</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setEditing(skill)}>
                    {t("Edit")}
                  </Button>
                  <Button variant="destructive" onClick={() => setDeleting(skill)}>
                    {t("Delete")}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(deleting)}
        title={t("Delete skill?")}
        description={`This will permanently remove "${deleting?.name}".`}
        onCancel={() => setDeleting(null)}
        onConfirm={() => deleting && deleteMutation.mutate(deleting.id)}
      />
    </AdminPageShell>
  );
};
