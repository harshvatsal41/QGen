import CreateQrForm from "@/components/CreateQrForm";

export const metadata = { title: "Create dynamic QR" };

export default function NewQrPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Create a dynamic QR</h1>
      <p className="mt-1 max-w-lg text-sm text-muted">
        The code encodes a short lumiqgen link. Print it anywhere — the
        destination stays editable and every scan is counted.
      </p>
      <div className="mt-6">
        <CreateQrForm />
      </div>
    </>
  );
}
