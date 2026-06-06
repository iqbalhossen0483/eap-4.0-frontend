"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  profileSchema,
  changePasswordSchema,
  type ProfileInput,
  type ChangePasswordInput,
} from "@/schemas/auth";
import {
  useGetMeQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} from "@/store/api/authApi";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";

function apiMessage(err: unknown, fallback: string): string {
  return (err as { data?: { message?: string } })?.data?.message ?? fallback;
}

export default function SettingsPage() {
  const router = useRouter();
  const { data: me } = useGetMeQuery();
  const [updateProfile, { isLoading: savingProfile }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: savingPassword }] =
    useChangePasswordMutation();

  const profileForm = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", avatar_url: "" },
  });

  // Populate the profile form once the current user loads
  useEffect(() => {
    if (me) {
      profileForm.reset({ name: me.name, avatar_url: me.avatar_url ?? "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me]);

  const passwordForm = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { current_password: "", new_password: "", confirmPassword: "" },
  });

  async function onSaveProfile(data: ProfileInput) {
    try {
      await updateProfile({
        name: data.name,
        avatar_url: data.avatar_url || undefined,
      }).unwrap();
      toast.success("Profile updated");
      router.refresh(); // re-read the session so name/avatar update everywhere
    } catch (err) {
      toast.error(apiMessage(err, "Failed to update profile"));
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
    <div className="max-w-2xl space-y-6">
      {/* Profile */}
      <Card variant="default" padding="lg">
        <Typography variant="h4" className="mb-4">
          Profile
        </Typography>
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
          <Input
            id="avatar_url"
            label="Avatar URL"
            placeholder="https://..."
            error={profileForm.formState.errors.avatar_url?.message}
            {...profileForm.register("avatar_url")}
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
      <Card variant="default" padding="lg">
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
