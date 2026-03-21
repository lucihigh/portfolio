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
import { CourseUnit } from "../../types";

const schema = z.object({
  stage: z.coerce.number().int().optional(),
  term: z.string().min(2),
  termVi: z.string().optional(),
  unitCode: z.string().min(2),
  unitName: z.string().min(2),
  unitNameVi: z.string().optional(),
  credits: z.coerce.number().int().default(15),
  grade: z.string().optional(),
  status: z.string().min(2),
  statusVi: z.string().optional(),
  sortOrder: z.coerce.number().int().default(0),
  isPublished: z.boolean()
});

type FormValues = z.infer<typeof schema>;

const initialValues: FormValues = {
  stage: undefined,
  term: "",
  termVi: "",
  unitCode: "",
  unitName: "",
  unitNameVi: "",
  credits: 15,
  grade: "",
  status: "Passed",
  statusVi: "",
  sortOrder: 0,
  isPublished: true
};

export const CourseUnitsPage = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<CourseUnit | null>(null);
  const [deleting, setDeleting] = useState<CourseUnit | null>(null);

  const { data } = useQuery({
    queryKey: ["course-units"],
    queryFn: async () => {
      const response = await adminApi.get<{ data: CourseUnit[] }>("/course-units");
      return response.data.data;
    }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: editing
      ? {
          stage: editing.stage ?? undefined,
          term: editing.term,
          termVi: editing.termVi || "",
          unitCode: editing.unitCode,
          unitName: editing.unitName,
          unitNameVi: editing.unitNameVi || "",
          credits: editing.credits,
          grade: editing.grade || "",
          status: editing.status,
          statusVi: editing.statusVi || "",
          sortOrder: editing.sortOrder,
          isPublished: editing.isPublished
        }
      : initialValues
  });

  const saveMutation = useMutation({
    mutationFn: async (values: FormValues) =>
      editing
        ? adminApi.put(`/course-units/${editing.id}`, {
            ...values,
            termVi: values.termVi || undefined,
            unitNameVi: values.unitNameVi || undefined,
            statusVi: values.statusVi || undefined
          })
        : adminApi.post("/course-units", {
            ...values,
            termVi: values.termVi || undefined,
            unitNameVi: values.unitNameVi || undefined,
            statusVi: values.statusVi || undefined
          }),
    onSuccess: async () => {
      toast.success(editing ? "Course unit updated" : "Course unit created");
      setEditing(null);
      form.reset(initialValues);
      await queryClient.invalidateQueries({ queryKey: ["course-units"] });
      await queryClient.invalidateQueries({ queryKey: ["public-data"] });
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to save course unit")
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => adminApi.delete(`/course-units/${id}`),
    onSuccess: async () => {
      toast.success("Course unit deleted");
      setDeleting(null);
      await queryClient.invalidateQueries({ queryKey: ["course-units"] });
      await queryClient.invalidateQueries({ queryKey: ["public-data"] });
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to delete course unit")
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = form;

  return (
    <AdminPageShell title="Course Units" description="Manage the full list of subjects, grades, status, and term information from your BTEC program.">
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
            {editing ? "Edit course unit" : "Add course unit"}
          </h2>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit((values) => saveMutation.mutate(values))}>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Stage">
                <Input type="number" {...register("stage")} />
              </FormField>
              <FormField label="Term" error={errors.term?.message}>
                <Input {...register("term")} placeholder="Fall 2024" />
              </FormField>
              <FormField label="Term (VI)">
                <Input {...register("termVi")} placeholder="Thu 2024" />
              </FormField>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Unit code" error={errors.unitCode?.message}>
                <Input {...register("unitCode")} />
              </FormField>
              <FormField label="Credits">
                <Input type="number" {...register("credits")} />
              </FormField>
            </div>
            <FormField label="Unit name" error={errors.unitName?.message}>
              <Input {...register("unitName")} />
            </FormField>
            <FormField label="Unit name (VI)">
              <Input {...register("unitNameVi")} />
            </FormField>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Grade">
                <Input {...register("grade")} placeholder="Pass / Merit / Distinction" />
              </FormField>
              <FormField label="Status" error={errors.status?.message}>
                <Input {...register("status")} placeholder="Passed / Studying" />
              </FormField>
              <FormField label="Status (VI)">
                <Input {...register("statusVi")} placeholder="Đã qua / Đang học" />
              </FormField>
            </div>
            <FormField label="Sort order">
              <Input type="number" {...register("sortOrder")} />
            </FormField>
            <label className="inline-flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-300" {...register("isPublished")} />
              Publish this course unit
            </label>
            <div className="flex gap-3">
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Saving..." : editing ? "Update course unit" : "Create course unit"}
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
          {data?.map((unit) => (
            <Card key={unit.id}>
              <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600">
                    {unit.term} • {unit.unitCode}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-bold text-slate-950 dark:text-white">{unit.unitName}</h3>
                  <p className="mt-2 text-sm font-semibold text-teal-600">
                    {unit.grade || "No grade yet"} • {unit.status} • {unit.credits} credits
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setEditing(unit)}>Edit</Button>
                  <Button variant="destructive" onClick={() => setDeleting(unit)}>Delete</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete course unit?"
        description={`This will permanently remove "${deleting?.unitName}".`}
        onCancel={() => setDeleting(null)}
        onConfirm={() => deleting && deleteMutation.mutate(deleting.id)}
      />
    </AdminPageShell>
  );
};
