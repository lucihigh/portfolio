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
import { useLocale } from "../../contexts/locale-context";
import { Profile } from "../../types";
import { splitLines } from "../../lib/format";

const schema = z.object({
  fullName: z.string().min(2),
  headline: z.string().min(2),
  headlineVi: z.string().optional(),
  shortBio: z.string().min(10),
  shortBioVi: z.string().optional(),
  about: z.string().min(20),
  aboutVi: z.string().optional(),
  strengthsText: z.string().min(2),
  strengthsTextVi: z.string().optional(),
  careerGoalsText: z.string().min(2),
  careerGoalsTextVi: z.string().optional(),
  avatarUrl: z.string().optional(),
  cvUrl: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  location: z.string().optional(),
  githubUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
  facebookUrl: z.string().optional(),
  heroPrimaryLabel: z.string().min(1),
  heroPrimaryLabelVi: z.string().optional(),
  heroPrimaryHref: z.string().min(1),
  heroSecondaryLabel: z.string().min(1),
  heroSecondaryLabelVi: z.string().optional(),
  heroSecondaryHref: z.string().min(1),
  isPublished: z.boolean()
});

type FormValues = z.infer<typeof schema>;

export const ProfilePage = () => {
  const { t } = useLocale();
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-profile"],
    queryFn: async () => {
      const response = await adminApi.get<{ data: Profile | null }>("/profile");
      return response.data.data;
    }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: {
      fullName: data?.fullName || "",
      headline: data?.headline || "",
      headlineVi: data?.headlineVi || "",
      shortBio: data?.shortBio || "",
      shortBioVi: data?.shortBioVi || "",
      about: data?.about || "",
      aboutVi: data?.aboutVi || "",
      strengthsText: data?.strengths.join("\n") || "",
      strengthsTextVi: data?.strengthsVi?.join("\n") || "",
      careerGoalsText: data?.careerGoals.join("\n") || "",
      careerGoalsTextVi: data?.careerGoalsVi?.join("\n") || "",
      avatarUrl: data?.avatarUrl || "",
      cvUrl: data?.cvUrl || "",
      email: data?.email || "",
      phone: data?.phone || "",
      location: data?.location || "",
      githubUrl: data?.githubUrl || "",
      linkedinUrl: data?.linkedinUrl || "",
      facebookUrl: data?.facebookUrl || "",
      heroPrimaryLabel: data?.heroPrimaryLabel || "View Projects",
      heroPrimaryLabelVi: data?.heroPrimaryLabelVi || "",
      heroPrimaryHref: data?.heroPrimaryHref || "#projects",
      heroSecondaryLabel: data?.heroSecondaryLabel || "Contact Me",
      heroSecondaryLabelVi: data?.heroSecondaryLabelVi || "",
      heroSecondaryHref: data?.heroSecondaryHref || "#contact",
      isPublished: data?.isPublished ?? true
    }
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) =>
      adminApi.put("/profile", {
        fullName: values.fullName,
        headline: values.headline,
        headlineVi: values.headlineVi || undefined,
        shortBio: values.shortBio,
        shortBioVi: values.shortBioVi || undefined,
        about: values.about,
        aboutVi: values.aboutVi || undefined,
        strengths: splitLines(values.strengthsText),
        strengthsVi: splitLines(values.strengthsTextVi || ""),
        careerGoals: splitLines(values.careerGoalsText),
        careerGoalsVi: splitLines(values.careerGoalsTextVi || ""),
        avatarUrl: values.avatarUrl || undefined,
        cvUrl: values.cvUrl || undefined,
        email: values.email,
        phone: values.phone || undefined,
        location: values.location || undefined,
        githubUrl: values.githubUrl || undefined,
        linkedinUrl: values.linkedinUrl || undefined,
        facebookUrl: values.facebookUrl || undefined,
        heroPrimaryLabel: values.heroPrimaryLabel,
        heroPrimaryLabelVi: values.heroPrimaryLabelVi || undefined,
        heroPrimaryHref: values.heroPrimaryHref,
        heroSecondaryLabel: values.heroSecondaryLabel,
        heroSecondaryLabelVi: values.heroSecondaryLabelVi || undefined,
        heroSecondaryHref: values.heroSecondaryHref,
        isPublished: values.isPublished
      }),
    onSuccess: async () => {
      toast.success(t("Profile saved"));
      await queryClient.invalidateQueries({ queryKey: ["admin-profile"] });
      await queryClient.invalidateQueries({ queryKey: ["public-data"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t("Failed to save profile"));
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = form;

  return (
    <AdminPageShell title={t("Profile")} description={t("Update your main personal information, hero content, contact basics, and profile media.")}>
      <Card>
        <form className="grid gap-5 lg:grid-cols-2" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
          <FormField label={t("Full name")} error={errors.fullName?.message}>
            <Input {...register("fullName")} />
          </FormField>
          <FormField label={t("Headline")} error={errors.headline?.message}>
            <Input {...register("headline")} />
          </FormField>
          <FormField label={`${t("Headline")} (VI)`}>
            <Input {...register("headlineVi")} />
          </FormField>
          <div className="lg:col-span-2">
            <FormField label={t("Short bio")} error={errors.shortBio?.message}>
              <Textarea {...register("shortBio")} />
            </FormField>
          </div>
          <div className="lg:col-span-2">
            <FormField label={`${t("Short bio")} (VI)`}>
              <Textarea {...register("shortBioVi")} />
            </FormField>
          </div>
          <div className="lg:col-span-2">
            <FormField label={t("About me")} error={errors.about?.message}>
              <Textarea {...register("about")} />
            </FormField>
          </div>
          <FormField label={t("Strengths")} error={errors.strengthsText?.message} hint={t("One item per line")}>
            <Textarea {...register("strengthsText")} />
          </FormField>
          <FormField label={`${t("Strengths")} (VI)`} hint={t("One item per line")}>
            <Textarea {...register("strengthsTextVi")} />
          </FormField>
          <div className="lg:col-span-2">
            <FormField label={`${t("About me")} (VI)`}>
              <Textarea {...register("aboutVi")} />
            </FormField>
          </div>
          <FormField label={t("Career Goals")} error={errors.careerGoalsText?.message} hint={t("One item per line")}>
            <Textarea {...register("careerGoalsText")} />
          </FormField>
          <FormField label={`${t("Career Goals")} (VI)`} hint={t("One item per line")}>
            <Textarea {...register("careerGoalsTextVi")} />
          </FormField>
          <FormField label={t("Avatar URL")}>
            <Input {...register("avatarUrl")} />
          </FormField>
          <FormField label={t("CV URL")}>
            <Input {...register("cvUrl")} />
          </FormField>
          <FormField label={t("Email")} error={errors.email?.message}>
            <Input type="email" {...register("email")} />
          </FormField>
          <FormField label={t("Phone")}>
            <Input {...register("phone")} />
          </FormField>
          <FormField label={t("Location")}>
            <Input {...register("location")} />
          </FormField>
          <FormField label={t("GitHub URL")}>
            <Input {...register("githubUrl")} />
          </FormField>
          <FormField label={t("LinkedIn URL")}>
            <Input {...register("linkedinUrl")} />
          </FormField>
          <FormField label={t("Facebook URL")}>
            <Input {...register("facebookUrl")} />
          </FormField>
          <FormField label={t("Hero primary label")}>
            <Input {...register("heroPrimaryLabel")} />
          </FormField>
          <FormField label={`${t("Hero primary label")} (VI)`}>
            <Input {...register("heroPrimaryLabelVi")} />
          </FormField>
          <FormField label={t("Hero primary href")}>
            <Input {...register("heroPrimaryHref")} />
          </FormField>
          <FormField label={t("Hero secondary label")}>
            <Input {...register("heroSecondaryLabel")} />
          </FormField>
          <FormField label={`${t("Hero secondary label")} (VI)`}>
            <Input {...register("heroSecondaryLabelVi")} />
          </FormField>
          <FormField label={t("Hero secondary href")}>
            <Input {...register("heroSecondaryHref")} />
          </FormField>
          <label className="inline-flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300 lg:col-span-2">
            <input type="checkbox" className="h-4 w-4 rounded border-slate-300" {...register("isPublished")} />
            {t("Publish profile on public site")}
          </label>
          <div className="lg:col-span-2">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? t("Saving...") : t("Save profile")}
            </Button>
          </div>
        </form>
      </Card>
    </AdminPageShell>
  );
};
