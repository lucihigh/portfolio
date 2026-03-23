import { ChangeEvent, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, ImagePlus, LoaderCircle, Send, Star, Upload } from "lucide-react";
import { publicApi } from "../../lib/api";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { FormField } from "../../components/ui/form-field";
import { Input } from "../../components/ui/input";
import { LanguageToggle } from "../../components/ui/language-toggle";
import { ThemeToggle } from "../../components/ui/theme-toggle";
import { Textarea } from "../../components/ui/textarea";
import { useLocale } from "../../contexts/locale-context";
import { useThemeMode } from "../../hooks/use-theme-mode";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  role: z.string().min(2, "Please enter your role"),
  company: z.string().optional(),
  content: z.string().min(10, "Please write a little more"),
  avatarUrl: z.string().url("Please enter a valid image URL").optional().or(z.literal(""))
});

type FormValues = z.infer<typeof schema>;

export const FeedbackPage = () => {
  const { darkMode, toggleTheme } = useThemeMode();
  const { locale, toggleLocale, t } = useLocale();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      role: "",
      company: "",
      content: "",
      avatarUrl: ""
    }
  });

  const avatarField = register("avatarUrl");
  const avatarUrl = watch("avatarUrl");

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await publicApi.post("/public/avatar-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      return response.data.data.url as string;
    },
    onSuccess: (url) => {
      setValue("avatarUrl", url, { shouldDirty: true, shouldValidate: true });
      toast.success(locale === "vi" ? "Tai anh len thanh cong." : "Avatar uploaded successfully.");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || (locale === "vi" ? "Khong the tai anh len." : "Could not upload image."));
    }
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const response = await publicApi.post("/public/testimonials", {
        ...values,
        company: values.company || undefined,
        avatarUrl: values.avatarUrl || undefined
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success(t("Your feedback has been saved and is now visible on the website."));
      reset();
      setSelectedFileName("");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t("Could not submit feedback"));
    }
  });

  const handleChooseAvatar = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarPicked = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);
    await uploadMutation.mutateAsync(file);
    event.target.value = "";
  };

  const avatarHint = selectedFileName
    ? locale === "vi"
      ? `Anh da chon: ${selectedFileName}`
      : `Selected image: ${selectedFileName}`
    : locale === "vi"
      ? "Co the dan URL hoac bam nut de tai anh truc tiep tu dien thoai hay may tinh."
      : "Paste an image URL or upload directly from your phone or computer.";

  return (
    <div className="container-shell py-10 lg:py-16">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="section-heading">{t("Feedback Form")}</p>
          <h1 className="section-title">{t("Share your evaluation in one quick form.")}</h1>
          <p className="section-copy">
            {t("Fill in your information, write your testimonial, and once you save it, the feedback will appear on the public portfolio automatically.")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => window.location.assign("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("Back to portfolio")}
          </Button>
          <LanguageToggle locale={locale} onToggle={toggleLocale} />
          <ThemeToggle darkMode={darkMode} onToggle={toggleTheme} />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="rounded-[1.5rem] bg-slate-950 text-white dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <span className="pixel-chip">
              <Star className="mr-2 h-3 w-3" />
              {t("Public testimonial")}
            </span>
          </div>
          <h2 className="mt-6 font-display text-4xl font-bold">
            {t("A short evaluation can help this portfolio feel much more real and trustworthy.")}
          </h2>
          <div className="mt-8 space-y-4 text-sm leading-7 text-slate-300">
            <p>{t("Use this page for lecturer feedback, teammate reviews, mentor endorsements, or collaboration notes.")}</p>
            <p>{t("You can paste an avatar image URL if you want your feedback card to include your photo.")}</p>
            <p>{t("If you leave the image field empty, a clean default profile avatar will be used automatically.")}</p>
            <p>
              {t("Prefer to review the site first? ")}
              <Link to="/" className="text-cyan-300 underline">
                {t("Open the portfolio")}
              </Link>
              .
            </p>
          </div>
        </Card>

        <Card className="rounded-[1.5rem]">
          <form className="space-y-5" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
            <div className="grid gap-5 md:grid-cols-2">
              <FormField label={t("Your name")} error={errors.name?.message ? t(errors.name.message) : undefined}>
                <Input {...register("name")} placeholder="Nguyen Van A" />
              </FormField>
              <FormField label={t("Role / title")} error={errors.role?.message ? t(errors.role.message) : undefined}>
                <Input
                  {...register("role")}
                  placeholder={locale === "vi" ? "Giang vien, Mentor, Dong doi..." : "Lecturer, Mentor, Teammate..."}
                />
              </FormField>
            </div>

            <FormField label={t("Organization / company")}>
              <Input
                {...register("company")}
                placeholder={locale === "vi" ? "Truong hoc, cau lac bo, cong ty..." : "University, club, company..."}
              />
            </FormField>

            <FormField
              label={t("Avatar URL")}
              error={errors.avatarUrl?.message ? t(errors.avatarUrl.message) : undefined}
              hint={avatarHint}
            >
              <div className="space-y-3">
                <Input
                  {...avatarField}
                  value={avatarUrl}
                  placeholder={locale === "vi" ? "URL anh tuy chon" : "Optional image URL"}
                  onChange={(event) => {
                    avatarField.onChange(event);
                    if (!event.target.value) {
                      setSelectedFileName("");
                    }
                  }}
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="hidden"
                  onChange={handleAvatarPicked}
                />
                <div className="flex flex-wrap gap-3">
                  <Button type="button" variant="outline" onClick={handleChooseAvatar} disabled={uploadMutation.isPending}>
                    <ImagePlus className="mr-2 h-4 w-4" />
                    {locale === "vi" ? "Chon anh" : "Choose image"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleChooseAvatar}
                    disabled={uploadMutation.isPending}
                    className="border-[3px] border-dashed border-slate-300 dark:border-slate-700"
                  >
                    {uploadMutation.isPending ? (
                      <>
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        {locale === "vi" ? "Dang tai anh..." : "Uploading image..."}
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        {locale === "vi" ? "Tai anh tu may" : "Upload from device"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </FormField>

            <FormField label={t("Your evaluation")} error={errors.content?.message ? t(errors.content.message) : undefined}>
              <Textarea
                {...register("content")}
                placeholder={t("Write a short testimonial about working, learning, or collaborating with LÃª Danh Äáº¡t...")}
                className="min-h-40"
              />
            </FormField>

            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={mutation.isPending || uploadMutation.isPending}>
                <Send className="mr-2 h-4 w-4" />
                {mutation.isPending ? t("Saving...") : t("Save feedback")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset();
                  setSelectedFileName("");
                }}
              >
                {t("Clear form")}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
