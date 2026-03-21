import { useMemo, useState } from "react";
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
import { CourseUnit, Project } from "../../types";
import { splitComma, splitLines } from "../../lib/format";

const unitSchema = z.object({
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
  isPublished: z.boolean(),
  description: z.string().optional(),
  descriptionVi: z.string().optional(),
  courseScore: z.string().optional(),
  imageUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  demoUrl: z.string().optional(),
  technologiesText: z.string().optional(),
  technologiesTextVi: z.string().optional(),
  highlightsText: z.string().optional(),
  highlightsTextVi: z.string().optional()
});

type UnitFormValues = z.infer<typeof unitSchema>;

const initialUnitValues: UnitFormValues = {
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
  isPublished: true,
  description: "",
  descriptionVi: "",
  courseScore: "",
  imageUrl: "",
  githubUrl: "",
  demoUrl: "",
  technologiesText: "",
  technologiesTextVi: "",
  highlightsText: "",
  highlightsTextVi: ""
};

const normalizeLookup = (value?: string | null) =>
  (value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const makeProjectPayload = (values: UnitFormValues) => ({
  title: values.unitName,
  titleVi: values.unitNameVi || undefined,
  slug: `course-${values.unitCode.toLowerCase()}`,
  description:
    values.description?.trim() ||
    `${values.unitName} showcase card with coursework details, score, and product links.`,
  descriptionVi: values.descriptionVi || undefined,
  courseScore: values.courseScore || undefined,
  role: "Course Showcase",
  roleVi: "Trình bày môn học",
  imageUrl: values.imageUrl || undefined,
  githubUrl: values.githubUrl || undefined,
  demoUrl: values.demoUrl || undefined,
  technologies: splitComma(values.technologiesText || ""),
  technologiesVi: splitComma(values.technologiesTextVi || ""),
  highlights: splitLines(values.highlightsText || ""),
  highlightsVi: splitLines(values.highlightsTextVi || ""),
  sortOrder: values.sortOrder,
  isFeatured: false,
  isPublished: values.isPublished
});

const hasProjectData = (values: UnitFormValues) =>
  Boolean(
    values.description?.trim() ||
      values.descriptionVi?.trim() ||
      values.courseScore?.trim() ||
      values.imageUrl?.trim() ||
      values.githubUrl?.trim() ||
      values.demoUrl?.trim() ||
      values.technologiesText?.trim() ||
      values.technologiesTextVi?.trim() ||
      values.highlightsText?.trim() ||
      values.highlightsTextVi?.trim()
  );

export const ProjectsPage = () => {
  const queryClient = useQueryClient();
  const [editingUnit, setEditingUnit] = useState<CourseUnit | null>(null);
  const [deletingUnit, setDeletingUnit] = useState<CourseUnit | null>(null);

  const { data: courseUnits } = useQuery({
    queryKey: ["course-units"],
    queryFn: async () => {
      const response = await adminApi.get<{ data: CourseUnit[] }>("/course-units");
      return response.data.data;
    }
  });

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await adminApi.get<{ data: Project[] }>("/projects");
      return response.data.data;
    }
  });

  const projectByUnitName = useMemo(() => {
    const map = new Map<string, Project>();
    (projects || []).forEach((project) => {
      map.set(normalizeLookup(project.title), project);
    });
    return map;
  }, [projects]);

  const activeProject = editingUnit ? projectByUnitName.get(normalizeLookup(editingUnit.unitName)) : null;

  const unitForm = useForm<UnitFormValues>({
    resolver: zodResolver(unitSchema),
    values: editingUnit
      ? {
          stage: editingUnit.stage ?? undefined,
          term: editingUnit.term,
          termVi: editingUnit.termVi || "",
          unitCode: editingUnit.unitCode,
          unitName: editingUnit.unitName,
          unitNameVi: editingUnit.unitNameVi || "",
          credits: editingUnit.credits,
          grade: editingUnit.grade || "",
          status: editingUnit.status,
          statusVi: editingUnit.statusVi || "",
          sortOrder: editingUnit.sortOrder,
          isPublished: editingUnit.isPublished,
          description: activeProject?.description || "",
          descriptionVi: activeProject?.descriptionVi || "",
          courseScore: activeProject?.courseScore || "",
          imageUrl: activeProject?.imageUrl || "",
          githubUrl: activeProject?.githubUrl || "",
          demoUrl: activeProject?.demoUrl || "",
          technologiesText: activeProject?.technologies.join(", ") || "",
          technologiesTextVi: activeProject?.technologiesVi?.join(", ") || "",
          highlightsText: activeProject?.highlights.join("\n") || "",
          highlightsTextVi: activeProject?.highlightsVi?.join("\n") || ""
        }
      : initialUnitValues
  });

  const saveUnitMutation = useMutation({
    mutationFn: async (values: UnitFormValues) => {
      const unitPayload = {
        stage: values.stage,
        term: values.term,
        termVi: values.termVi || undefined,
        unitCode: values.unitCode,
        unitName: values.unitName,
        unitNameVi: values.unitNameVi || undefined,
        credits: values.credits,
        grade: values.grade || undefined,
        status: values.status,
        statusVi: values.statusVi || undefined,
        sortOrder: values.sortOrder,
        isPublished: values.isPublished
      };

      let savedUnit: CourseUnit;

      if (editingUnit) {
        const response = await adminApi.put<{ data: CourseUnit }>(`/course-units/${editingUnit.id}`, unitPayload);
        savedUnit = response.data.data;
      } else {
        const response = await adminApi.post<{ data: CourseUnit }>("/course-units", unitPayload);
        savedUnit = response.data.data;
      }

      const previousProject = editingUnit ? projectByUnitName.get(normalizeLookup(editingUnit.unitName)) : null;
      const shouldPersistProject = hasProjectData(values);

      if (shouldPersistProject) {
        const projectPayload = makeProjectPayload(values);
        if (previousProject) {
          await adminApi.put(`/projects/${previousProject.id}`, projectPayload);
        } else {
          await adminApi.post("/projects", projectPayload);
        }
      } else if (previousProject) {
        await adminApi.delete(`/projects/${previousProject.id}`);
      }

      return savedUnit;
    },
    onSuccess: async () => {
      toast.success(editingUnit ? "Subject updated" : "Subject created");
      setEditingUnit(null);
      unitForm.reset(initialUnitValues);
      await queryClient.invalidateQueries({ queryKey: ["course-units"] });
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
      await queryClient.invalidateQueries({ queryKey: ["public-data"] });
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to save subject")
  });

  const deleteUnitMutation = useMutation({
    mutationFn: async (unit: CourseUnit) => {
      const linkedProject = projectByUnitName.get(normalizeLookup(unit.unitName));
      await adminApi.delete(`/course-units/${unit.id}`);
      if (linkedProject) {
        await adminApi.delete(`/projects/${linkedProject.id}`);
      }
    },
    onSuccess: async () => {
      toast.success("Subject deleted");
      setDeletingUnit(null);
      if (editingUnit?.id === deletingUnit?.id) {
        setEditingUnit(null);
        unitForm.reset(initialUnitValues);
      }
      await queryClient.invalidateQueries({ queryKey: ["course-units"] });
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
      await queryClient.invalidateQueries({ queryKey: ["public-data"] });
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to delete subject")
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = unitForm;

  return (
    <AdminPageShell
      title="Course Showcase"
      description="Only manage your real subjects here, including grades, GitHub links, demo links, image, and bilingual descriptions."
    >
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">Subject list</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Click a subject to edit it. This list is your real BTEC subject list.
          </p>
          <div className="mt-6 space-y-3">
            {courseUnits?.map((unit) => {
              const linkedProject = projectByUnitName.get(normalizeLookup(unit.unitName));
              const isActive = editingUnit?.id === unit.id;
              return (
                <button
                  key={unit.id}
                  type="button"
                  className="w-full text-left"
                  onClick={() => setEditingUnit(unit)}
                >
                  <Card className={isActive ? "border-cyan-300 bg-cyan-50/40 dark:border-cyan-200 dark:bg-slate-800" : ""}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600">
                          {unit.term} | {unit.unitCode}
                        </p>
                        <h3 className="mt-2 font-display text-xl font-bold text-slate-950 dark:text-white">{unit.unitName}</h3>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                          {unit.grade || "Pending"} | {unit.status} | {unit.credits} credits
                        </p>
                      </div>
                      <div className="text-right text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <p>{linkedProject ? "Has showcase links" : "No showcase links yet"}</p>
                        <p className="mt-2">Sort #{unit.sortOrder}</p>
                      </div>
                    </div>
                  </Card>
                </button>
              );
            })}
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
            {editingUnit ? "Edit subject card" : "Add subject"}
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Update the academic info and the public showcase content for this subject in one place.
          </p>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit((values) => saveUnitMutation.mutate(values))}>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Term" error={errors.term?.message}>
                <Input {...register("term")} />
              </FormField>
              <FormField label="Term (VI)">
                <Input {...register("termVi")} />
              </FormField>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <FormField label="Stage">
                <Input type="number" {...register("stage")} />
              </FormField>
              <FormField label="Unit code" error={errors.unitCode?.message}>
                <Input {...register("unitCode")} />
              </FormField>
              <FormField label="Credits">
                <Input type="number" {...register("credits")} />
              </FormField>
            </div>

            <FormField label="Subject name" error={errors.unitName?.message}>
              <Input {...register("unitName")} />
            </FormField>
            <FormField label="Subject name (VI)">
              <Input {...register("unitNameVi")} />
            </FormField>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Grade">
                <Input {...register("grade")} placeholder="Pass / Merit / Distinction / D / M" />
              </FormField>
              <FormField label="Status" error={errors.status?.message}>
                <Input {...register("status")} placeholder="Passed / Studying" />
              </FormField>
            </div>

            <FormField label="Status (VI)">
              <Input {...register("statusVi")} placeholder="Đã qua / Đang học" />
            </FormField>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Course score">
                <Input {...register("courseScore")} placeholder="9.2 / 10" />
              </FormField>
              <FormField label="Sort order">
                <Input type="number" {...register("sortOrder")} />
              </FormField>
            </div>

            <FormField label="Public description">
              <Textarea {...register("description")} placeholder="Describe the coursework, output, and what this subject project showcases." />
            </FormField>
            <FormField label="Public description (VI)">
              <Textarea {...register("descriptionVi")} placeholder="Mô tả nội dung môn học, sản phẩm và điểm nổi bật của card này." />
            </FormField>

            <FormField label="Image URL">
              <Input {...register("imageUrl")} />
            </FormField>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="GitHub URL">
                <Input {...register("githubUrl")} />
              </FormField>
              <FormField label="Demo URL">
                <Input {...register("demoUrl")} />
              </FormField>
            </div>

            <FormField label="Technologies" hint="Separate items with commas">
              <Input {...register("technologiesText")} />
            </FormField>
            <FormField label="Technologies (VI)" hint="Separate items with commas">
              <Input {...register("technologiesTextVi")} />
            </FormField>

            <FormField label="Highlights" hint="One item per line">
              <Textarea {...register("highlightsText")} />
            </FormField>
            <FormField label="Highlights (VI)" hint="One item per line">
              <Textarea {...register("highlightsTextVi")} />
            </FormField>

            <label className="inline-flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-300" {...register("isPublished")} />
              Publish this subject
            </label>

            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={saveUnitMutation.isPending}>
                {saveUnitMutation.isPending ? "Saving..." : editingUnit ? "Update subject" : "Create subject"}
              </Button>
              {editingUnit ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingUnit(null);
                      unitForm.reset(initialUnitValues);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="button" variant="destructive" onClick={() => setDeletingUnit(editingUnit)}>
                    Delete subject
                  </Button>
                </>
              ) : null}
            </div>
          </form>
        </Card>
      </div>

      <ConfirmDialog
        open={Boolean(deletingUnit)}
        title="Delete subject?"
        description={`This will permanently remove "${deletingUnit?.unitName}" and its linked showcase card if one exists.`}
        onCancel={() => setDeletingUnit(null)}
        onConfirm={() => deletingUnit && deleteUnitMutation.mutate(deletingUnit)}
      />
    </AdminPageShell>
  );
};
