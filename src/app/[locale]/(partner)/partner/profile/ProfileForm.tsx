"use client";

import { useState, useTransition } from "react";
import { updateProfile } from "@/app/actions/profile";
import { AuthUser } from "@/lib/auth";
import { User, Mail, Phone, FileText, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface ProfileFormProps {
  user: AuthUser;
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(formData: FormData) {
    setMessage(null);
    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else if (result.success) {
        setMessage({ type: "success", text: result.success });
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      {message && (
        <div
          className={`animate-in fade-in slide-in-from-top-2 flex items-center gap-3 rounded-2xl p-4 text-sm font-medium duration-300 ${
            message.type === "success"
              ? "border border-emerald-100 bg-emerald-50 text-gray-800"
              : "border border-red-100 bg-red-50 text-red-700"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Full Name */}
        <div className="space-y-2">
          <label
            htmlFor="full_name"
            className="flex items-center gap-2 text-sm font-semibold text-gray-700"
          >
            <User className="h-4 w-4 text-gray-400" />
            Full Name
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            defaultValue={user.full_name}
            required
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 transition-all placeholder:text-gray-700 focus:border-[#67B500] focus:ring-4 focus:ring-[#67B500]/5 focus:outline-none"
            placeholder="John Doe"
          />
        </div>

        {/* Email - Read Only for now as it's linked to Auth */}
        <div className="space-y-2 opacity-70">
          <label
            htmlFor="email"
            className="flex items-center gap-2 text-sm font-semibold text-gray-700"
          >
            <Mail className="h-4 w-4 text-gray-400" />
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={user.email}
            readOnly
            className="w-full cursor-not-allowed rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-500 outline-none"
          />
          <p className="ml-1 text-[10px] text-gray-400">
            Email cannot be changed from the profile settings.
          </p>
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label
            htmlFor="phone"
            className="flex items-center gap-2 text-sm font-semibold text-gray-700"
          >
            <Phone className="h-4 w-4 text-gray-400" />
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={user.phone || ""}
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 transition-all placeholder:text-gray-700 focus:border-[#67B500] focus:ring-4 focus:ring-[#67B500]/5 focus:outline-none"
            placeholder="+212 600-000000"
          />
        </div>

        {/* Role - Display only */}
        <div className="space-y-2 opacity-70">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <CheckCircle2 className="h-4 w-4 text-gray-400" />
            Account Role
          </label>
          <div className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-500 capitalize">
            {user.role}
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <label
          htmlFor="bio"
          className="flex items-center gap-2 text-sm font-semibold text-gray-700"
        >
          <FileText className="h-4 w-4 text-gray-400" />
          Bio / Notes
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          defaultValue={user.bio || ""}
          className="w-full resize-none rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 transition-all placeholder:text-gray-700 focus:border-[#67B500] focus:ring-4 focus:ring-[#67B500]/5 focus:outline-none"
          placeholder="Write a short bio or internal notes..."
        />
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-[#67B500] px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#67B500]/90 disabled:opacity-70"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving Changes...
            </>
          ) : (
            <>Save Profile</>
          )}
        </button>
      </div>
    </form>
  );
}
