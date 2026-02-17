import { Toaster } from "react-hot-toast";

export default function AppToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 2600,
        className:
          "!rounded-xl !border !shadow-lg !bg-white !text-zinc-900 !border-zinc-200 dark:!bg-zinc-900 dark:!text-zinc-100 dark:!border-zinc-700",
        success: {
          iconTheme: {
            primary: "#16a34a",
            secondary: "#ffffff",
          },
        },
      }}
    />
  );
}
