"use client";

import {
  Toaster as HotToaster,
  toast as hotToast,
  type ToastOptions,
} from "react-hot-toast";

const baseStyle: ToastOptions["style"] = {
  background: "#181818",
  color: "#fff",
  fontSize: "14px",
  letterSpacing: "-0.02em",
  borderRadius: "12px",
  padding: "10px 14px",
  fontFamily: "var(--font-bricolage)",
  boxShadow:
    "0 1px 2px rgba(16,24,40,0.10), 0 12px 24px -8px rgba(16,24,40,0.25)",
};

export function toast(
  message: string,
  variant: "success" | "error" | "info" | "loading" = "info",
) {
  const opts: ToastOptions = { duration: 3500, style: baseStyle };
  if (variant === "success") return hotToast.success(message, opts);
  if (variant === "error") return hotToast.error(message, opts);
  if (variant === "loading")
    return hotToast.loading(message, { ...opts, duration: Infinity });
  return hotToast(message, opts);
}

toast.dismiss = hotToast.dismiss;

export function Toaster() {
  return <HotToaster position="bottom-right" gutter={8} />;
}
