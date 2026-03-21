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
import { Activity } from "../../types";
import { splitLines, toInputDate } from "../../lib/format";

const schema = z.object({
  title: z.string().min(2),
  titleVi: z.string().optional(),
  organization: z.string().min(2),
  organizationVi: z.string().optional(),
  slug: z.string().min(2),
  description: z.string().min(10),
  descriptionVi: z.string().optional(),
  role: z.string().optional(),
  roleVi: z.string().optional(),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  location: z.string().optional(),
  highlightsText: z.string().optional(),
  highlightsTextVi: z.string().optional(),
  imageUrl: z.string().optional(),
  sortOrder: z.coerce.number().default(0),
  isPublished: z.boolean()
});

type FormValues = z.infer<typeof schema>;

const initialValues: FormValues = {
  title: "",
  titleVi: "",
  organization: "",
  organizationVi: "",
  slug: "",
  description: "",
  descriptionVi: "",
  role: "",
  roleVi: "",
  startDate: "",
  endDate: "",
  location: "",
  highlightsText: "",
  highlightsTextVi: "",
  imageUrl: "",
  sortOrder: 0,
  isPublished: true
};

export const ActivitiesPage = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Activity | null>(null);
  const [deleting, setDeleting] = useState<Activity | null>(null);

  const { data } = useQuery({
    queryKey: ["activities"],
    queryFn: async () => {
      const response = await adminApi.get<{ data: Activity[] }>("/activities");
      return response.data.data;
    }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: editing
      ? {
          title: editing.title,
          titleVi: editing.titleVi || "",
          organization: editing.organization,
          organizationVi: editing.organizationVi || "",
          slug: editing.slug,
          description: editing.description,
          descriptionVi: editing.descriptionVi || "",
          role: editing.role || "",
          roleVi: editing.roleVi || "",
          startDate: toInputDate(editing.startDate),
          endDate: toInputDate(editing.endDate),
          location: editing.location || "",
          highlightsText: editing.highlights.join("\n"),
          highlightsTextVi: editing.highlightsVi?.join("\n") || "",
          imageUrl: editing.imageUrl || "",
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
        organizationVi: values.organizationVi || undefined,
        descriptionVi: values.descriptionVi || undefined,
        roleVi: values.roleVi || undefined,
        startDate: new Date(values.startDate).toISOString(),
        endDate: values.endDate ? new Date(values.endDate).toISOString() : undefined,
        highlights: splitLines(values.highlightsText || ""),
        highlightsVi: splitLines(values.highlightsTextVi || "")
      };
      return editing
        ? adminApi.put(`/activities/${editing.id}`, payload)
        : adminApi.post("/activities", payload);
    },
    onSuccess: async () => {
      toast.success(editing ? "Activity updated" : "Activity created");
      setEditing(null);
      form.reset(initialValues);
      await queryClient.invalidateQueries({ queryKey: ["activities"] });
      await queryClient.invalidateQueries({ queryKey: ["public-data"] });
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to save activity")
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => adminApi.delete(`/activities/${id}`),
    onSuccess: async () => {
      toast.success("Activity deleted");
      setDeleting(null);
      await queryClient.invalidateQueries({ queryKey: ["activities"] });
      await queryClient.invalidateQueries({ queryKey: ["public-data"] });
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to delete activity")
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = form;

  return (
    <AdminPageShell title="Activities" description="Maintain your competition timeline, club participation, and leadership experiences.">
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
            {editing ? "Edit activity" : "Add activity"}
          </h2>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit((values) => saveMutation.mutate(values))}>
            <FormField label="Title" error={errors.title?.message}>
              <Input {...register("title")} />
            </FormField>
            <FormField label="Title (VI)">
              <Input {...register("titleVi")} />
            </FormField>
            <FormField label="Organization" error={errors.organization?.message}>
              <Input {...register("organization")} />
            </FormField>
            <FormField label="Organization (VI)">
              <Input {...register("organizationVi")} />
            </FormField>
            <FormField label="Slug" error={errors.slug?.message}>
              <Input {...register("slug")} />
            </FormField>
            <FormField label="Role">
              <Input {...register("role")} />
            </FormField>
            <FormField label="Role (VI)">
              <Input {...register("roleVi")} />
            </FormField>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Start date" error={errors.startDate?.message}>
                <Input type="date" {...register("startDate")} />
              </FormField>
              <FormField label="End date">
                <Input type="date" {...register("endDate")} />
              </FormField>
            </div>
            <FormField label="Location">
              <Input {...register("location")} />
            </FormField>
            <FormField label="Description" error={errors.description?.message}>
              <Textarea {...register("description")} />
            </FormField>
            <FormField label="Description (VI)">
              <Textarea {...register("descriptionVi")} />
            </FormField>
            <FormField label="Highlights" hint="One item per line">
              <Textarea {...register("highlightsText")} />
            </FormField>
            <FormField label="Highlights (VI)" hint="One item per line">
              <Textarea {...register("highlightsTextVi")} />
            </FormField>
            <FormField label="Image URL">
              <Input {...register("imageUrl")} />
            </FormField>
            <FormField label="Sort order">
              <Input type="number" {...register("sortOrder")} />
            </FormField>
            <label className="inline-flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-300" {...register("isPublished")} />
              Publish this activity
            </label>
            <div className="flex gap-3">
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Saving..." : editing ? "Update activity" : "Create activity"}
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
          {data?.map((activity) => (
            <Card key={activity.id}>
              <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
                <div>
                  <h3 className="font-display text-2xl font-bold text-slate-950 dark:text-white">{activity.title}</h3>
                  <p className="mt-2 text-sm font-semibold text-teal-600">
                    {activity.organization}
                    {activity.role ? ` • ${activity.role}` : ""}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{activity.description}</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setEditing(activity)}>Edit</Button>
                  <Button variant="destructive" onClick={() => setDeleting(activity)}>Delete</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete activity?"
        description={`This will permanently remove "${deleting?.title}".`}
        onCancel={() => setDeleting(null)}
        onConfirm={() => deleting && deleteMutation.mutate(deleting.id)}
      />
    </AdminPageShell>
  );
};
