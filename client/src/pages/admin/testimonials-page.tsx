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
import { Testimonial } from "../../types";

const schema = z.object({
  name: z.string().min(2),
  role: z.string().min(2),
  roleVi: z.string().optional(),
  company: z.string().optional(),
  companyVi: z.string().optional(),
  content: z.string().min(10),
  contentVi: z.string().optional(),
  avatarUrl: z.string().optional(),
  sortOrder: z.coerce.number().default(0),
  isPublished: z.boolean()
});

type FormValues = z.infer<typeof schema>;

const initialValues: FormValues = {
  name: "",
  role: "",
  roleVi: "",
  company: "",
  companyVi: "",
  content: "",
  contentVi: "",
  avatarUrl: "",
  sortOrder: 0,
  isPublished: true
};

export const TestimonialsPage = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [deleting, setDeleting] = useState<Testimonial | null>(null);

  const { data } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const response = await adminApi.get<{ data: Testimonial[] }>("/testimonials");
      return response.data.data;
    }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: editing
      ? {
          name: editing.name,
          role: editing.role,
          roleVi: editing.roleVi || "",
          company: editing.company || "",
          companyVi: editing.companyVi || "",
          content: editing.content,
          contentVi: editing.contentVi || "",
          avatarUrl: editing.avatarUrl || "",
          sortOrder: editing.sortOrder,
          isPublished: editing.isPublished
        }
      : initialValues
  });

  const saveMutation = useMutation({
    mutationFn: async (values: FormValues) =>
      editing
        ? adminApi.put(`/testimonials/${editing.id}`, values)
        : adminApi.post("/testimonials", values),
    onSuccess: async () => {
      toast.success(editing ? "Testimonial updated" : "Testimonial created");
      setEditing(null);
      form.reset(initialValues);
      await queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      await queryClient.invalidateQueries({ queryKey: ["public-data"] });
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to save testimonial")
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => adminApi.delete(`/testimonials/${id}`),
    onSuccess: async () => {
      toast.success("Testimonial deleted");
      setDeleting(null);
      await queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      await queryClient.invalidateQueries({ queryKey: ["public-data"] });
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to delete testimonial")
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = form;

  return (
    <AdminPageShell title="Testimonials" description="Collect and curate feedback from lecturers, teammates, mentors, and collaborators.">
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
            {editing ? "Edit testimonial" : "Add testimonial"}
          </h2>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit((values) => saveMutation.mutate(values))}>
            <FormField label="Name" error={errors.name?.message}>
              <Input {...register("name")} />
            </FormField>
            <FormField label="Role" error={errors.role?.message}>
              <Input {...register("role")} />
            </FormField>
            <FormField label="Role (VI)">
              <Input {...register("roleVi")} />
            </FormField>
            <FormField label="Company">
              <Input {...register("company")} />
            </FormField>
            <FormField label="Company (VI)">
              <Input {...register("companyVi")} />
            </FormField>
            <FormField label="Content" error={errors.content?.message}>
              <Textarea {...register("content")} />
            </FormField>
            <FormField label="Content (VI)">
              <Textarea {...register("contentVi")} />
            </FormField>
            <FormField label="Avatar URL">
              <Input {...register("avatarUrl")} />
            </FormField>
            <FormField label="Sort order">
              <Input type="number" {...register("sortOrder")} />
            </FormField>
            <label className="inline-flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-300" {...register("isPublished")} />
              Publish this testimonial
            </label>
            <div className="flex gap-3">
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Saving..." : editing ? "Update testimonial" : "Create testimonial"}
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
          {data?.map((testimonial) => (
            <Card key={testimonial.id}>
              <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
                <div>
                  <h3 className="font-display text-2xl font-bold text-slate-950 dark:text-white">{testimonial.name}</h3>
                  <p className="mt-2 text-sm font-semibold text-teal-600">
                    {testimonial.role}
                    {testimonial.company ? ` • ${testimonial.company}` : ""}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{testimonial.content}</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setEditing(testimonial)}>Edit</Button>
                  <Button variant="destructive" onClick={() => setDeleting(testimonial)}>Delete</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete testimonial?"
        description={`This will permanently remove the testimonial from "${deleting?.name}".`}
        onCancel={() => setDeleting(null)}
        onConfirm={() => deleting && deleteMutation.mutate(deleting.id)}
      />
    </AdminPageShell>
  );
};
