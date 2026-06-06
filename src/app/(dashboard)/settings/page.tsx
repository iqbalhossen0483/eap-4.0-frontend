"use client";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Upload } from "lucide-react";
import {
  changePasswordSchema,
  profileSchema,
  type ChangePasswordInput,
  type ProfileInput,
} from "@/schemas/auth";
import {
  useChangePasswordMutation,
  useGetMeQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
} from "@/store/api/authApi";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { Typography } from "@/components/ui/Typography";

function apiMessage(err: unknown, fallback: string): string {
  return (err as { data?: { message?: string } })?.data?.message ?? fallback;
}

export default function SettingsPage() {
  const router = useRouter();
  const { data: me } = useGetMeQuery();
  const [updateProfile, { isLoading: savingProfile }] =
    useUpdateProfileMutation();
  const [changePassword, { isLoading: savingPassword }] =
    useChangePasswordMutation();
  const [uploadAvatar, { isLoading: uploadingAvatar }] =
    useUploadAvatarMutation();
  const fileRef = useRef<HTMLInputElement>(null);

  const profileForm = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "" },
  });

  // Populate the profile form once the current user loads
  useEffect(() => {
    if (me) {
      profileForm.reset({ name: me.name });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me]);

  const passwordForm = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirmPassword: "",
    },
  });

  async function onSaveProfile(data: ProfileInput) {
    try {
      await updateProfile({ name: data.name }).unwrap();
      toast.success("Profile updated");
      router.refresh(); // re-read the session so name updates everywhere
    } catch (err) {
      toast.error(apiMessage(err, "Failed to update profile"));
    }
  }

  async function onAvatarSelected(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    try {
      await uploadAvatar(formData).unwrap();
      toast.success("Avatar updated");
      router.refresh();
    } catch (err) {
      toast.error(apiMessage(err, "Failed to upload avatar"));
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function onChangePassword(data: ChangePasswordInput) {
    try {
      await changePassword({
        current_password: data.current_password,
        new_password: data.new_password,
      }).unwrap();
      toast.success("Password changed");
      passwordForm.reset();
    } catch (err) {
      toast.error(apiMessage(err, "Failed to change password"));
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6">
      {/* Profile */}
      <Card variant="default" padding="lg" className="w-full">
        <Typography variant="h4" className="mb-4">
          Profile
        </Typography>

        {/* Avatar upload */}
        <div className="mb-5 flex items-center gap-4">
          <Avatar name={me?.name ?? "User"} src={me?.avatar_url} size="lg" />
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onAvatarSelected(file);
              }}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              loading={uploadingAvatar}
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="h-4 w-4" /> Change avatar
            </Button>
            <Typography variant="caption" className="mt-1 block">
              PNG, JPG, WEBP or GIF — up to 5 MB.
            </Typography>
          </div>
        </div>

        <form
          onSubmit={profileForm.handleSubmit(onSaveProfile)}
          className="space-y-4"
        >
          <Input
            id="name"
            label="Name"
            error={profileForm.formState.errors.name?.message}
            {...profileForm.register("name")}
          />
          <Input id="email" label="Email" value={me?.email ?? ""} disabled />
          <div className="flex justify-end">
            <Button type="submit" loading={savingProfile}>
              Save profile
            </Button>
          </div>
        </form>
      </Card>

      {/* Password */}
      <Card variant="default" padding="lg" className="w-full">
        <Typography variant="h4" className="mb-4">
          Change Password
        </Typography>
        <form
          onSubmit={passwordForm.handleSubmit(onChangePassword)}
          className="space-y-4"
        >
          <Input
            id="current_password"
            label="Current password"
            type="password"
            error={passwordForm.formState.errors.current_password?.message}
            {...passwordForm.register("current_password")}
          />
          <Input
            id="new_password"
            label="New password"
            type="password"
            error={passwordForm.formState.errors.new_password?.message}
            {...passwordForm.register("new_password")}
          />
          <Input
            id="confirmPassword"
            label="Confirm new password"
            type="password"
            error={passwordForm.formState.errors.confirmPassword?.message}
            {...passwordForm.register("confirmPassword")}
          />
          <div className="flex justify-end">
            <Button type="submit" loading={savingPassword}>
              Change password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
