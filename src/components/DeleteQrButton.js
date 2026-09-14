"use client";

import { deleteQr } from "@/app/actions";

export default function DeleteQrButton({ id, title }) {
  return (
    <form
      action={deleteQr}
      onSubmit={(e) => {
        if (!window.confirm(`Delete "${title}"? Printed copies of this code will stop working. This cannot be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button className="text-sm font-medium text-bad hover:underline">Delete this QR code</button>
    </form>
  );
}
