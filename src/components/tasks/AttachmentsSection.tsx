"use client";
import { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { Paperclip, Download, Trash2, Upload } from "lucide-react";
import {
  useGetAttachmentsQuery,
  useUploadAttachmentMutation,
  useDeleteAttachmentMutation,
} from "@/store/api/tasksApi";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { formatBytes } from "@/lib/utils";

export function AttachmentsSection({ taskId }: { taskId: string }) {
  const { data: session } = useSession();
  const { data: attachments, isLoading } = useGetAttachmentsQuery(taskId);
  const [uploadAttachment, { isLoading: uploading }] =
    useUploadAttachmentMutation();
  const [deleteAttachment] = useDeleteAttachmentMutation();
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  async function handleFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    try {
      await uploadAttachment({ taskId, formData }).unwrap();
      toast.success("File uploaded");
      setFileName(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ??
          "Failed to upload file",
      );
    }
  }

  async function remove(id: string) {
    try {
      await deleteAttachment(id).unwrap();
    } catch (err) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ??
          "Failed to delete attachment",
      );
    }
  }

  return (
    <div className="space-y-3">
      <Typography variant="label">Attachments</Typography>

      {isLoading ? (
        <Spinner className="h-5 w-5 text-gray-400" />
      ) : attachments?.length ? (
        <div className="space-y-1">
          {attachments.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between gap-2 rounded-lg border border-gray-100 px-3 py-2 dark:border-gray-800"
            >
              <div className="flex min-w-0 items-center gap-2">
                <Paperclip className="h-4 w-4 shrink-0 text-gray-400" />
                <div className="min-w-0">
                  <Typography variant="small" className="truncate">
                    {a.original_filename}
                  </Typography>
                  <Typography variant="caption" className="block">
                    {a.uploaded_by.name} • {formatBytes(a.file_size)}
                  </Typography>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <a
                  href={a.cloudinary_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
                  aria-label="Download"
                >
                  <Download className="h-4 w-4" />
                </a>
                {a.uploaded_by.id === session?.user?.id && (
                  <button
                    onClick={() => remove(a.id)}
                    className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30"
                    aria-label="Delete attachment"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Typography variant="muted">No attachments yet.</Typography>
      )}

      <div className="flex items-center gap-2">
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setFileName(file.name);
              handleFile(file);
            }
          }}
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          loading={uploading}
          onClick={() => fileRef.current?.click()}
        >
          <Upload className="h-4 w-4" /> Upload file
        </Button>
        {fileName && (
          <Typography variant="caption" className="truncate">
            {fileName}
          </Typography>
        )}
      </div>
    </div>
  );
}
