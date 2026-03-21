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
import { ContactLink } from "../../types";

const schema = z.object({
  platform: z.string().min(1),
  platformVi: z.string().optional(),
  label: z.string().min(1),
  labelVi: z.string().optional(),
  url: z.string().url(),
  icon: z.string().optional(),
  sortOrder: z.coerce.number().default(0),
  isPublished: z.boolean()
});

type FormValues = z.infer<typeof schema>;

const initialValues: FormValues = {
  platform: "",
  platformVi: "",
  label: "",
  labelVi: "",
  url: "",
  icon: "",
  sortOrder: 0,
  isPublished: true
};

export const ContactsPage = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<ContactLink | null>(null);
  const [deleting, setDeleting] = useState<ContactLink | null>(null);

  const { data } = useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const response = await adminApi.get<{ data: ContactLink[] }>("/contacts");
      return response.data.data;
    }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: editing
      ? {
          platform: editing.platform,
          platformVi: editing.platformVi || "",
          label: editing.label,
          labelVi: editing.labelVi || "",
          url: editing.url,
          icon: editing.icon || "",
          sortOrder: editing.sortOrder,
          isPublished: editing.isPublished
        }
      : initialValues
  });

  const saveMutation = useMutation({
    mutationFn: async (values: FormValues) =>
      editing
        ? adminApi.put(`/contacts/${editing.id}`, values)
        : adminApi.post("/contacts", values),
    onSuccess: async () => {
      toast.success(editing ? "Contact updated" : "Contact created");
      setEditing(null);
      form.reset(initialValues);
      await queryClient.invalidateQueries({ queryKey: ["contacts"] });
      await queryClient.invalidateQueries({ queryKey: ["public-data"] });
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to save contact")
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => adminApi.delete(`/contacts/${id}`),
    onSuccess: async () => {
      toast.success("Contact deleted");
      setDeleting(null);
      await queryClient.invalidateQueries({ queryKey: ["contacts"] });
      await queryClient.invalidateQueries({ queryKey: ["public-data"] });
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to delete contact")
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = form;

  return (
    <AdminPageShell title="Contacts" description="Publish communication channels and social profiles that appear in the contact section.">
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
            {editing ? "Edit contact" : "Add contact"}
          </h2>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit((values) => saveMutation.mutate(values))}>
            <FormField label="Platform" error={errors.platform?.message}>
              <Input {...register("platform")} />
            </FormField>
            <FormField label="Platform (VI)">
              <Input {...register("platformVi")} />
            </FormField>
            <FormField label="Label" error={errors.label?.message}>
              <Input {...register("label")} />
            </FormField>
            <FormField label="Label (VI)">
              <Input {...register("labelVi")} />
            </FormField>
            <FormField label="URL" error={errors.url?.message}>
              <Input {...register("url")} />
            </FormField>
            <FormField label="Icon key">
              <Input {...register("icon")} />
            </FormField>
            <FormField label="Sort order">
              <Input type="number" {...register("sortOrder")} />
            </FormField>
            <label className="inline-flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-300" {...register("isPublished")} />
              Publish this contact
            </label>
            <div className="flex gap-3">
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Saving..." : editing ? "Update contact" : "Create contact"}
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
          {data?.map((contact) => (
            <Card key={contact.id}>
              <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
                <div>
                  <h3 className="font-display text-2xl font-bold text-slate-950 dark:text-white">{contact.platform}</h3>
                  <p className="mt-2 text-sm font-semibold text-teal-600">{contact.label}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{contact.url}</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setEditing(contact)}>Edit</Button>
                  <Button variant="destructive" onClick={() => setDeleting(contact)}>Delete</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete contact?"
        description={`This will permanently remove "${deleting?.platform}".`}
        onCancel={() => setDeleting(null)}
        onConfirm={() => deleting && deleteMutation.mutate(deleting.id)}
      />
    </AdminPageShell>
  );
};
