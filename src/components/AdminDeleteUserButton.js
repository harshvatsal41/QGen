"use client";

import { adminDeleteUser } from "@/app/admin-actions";

export default function AdminDeleteUserButton({ userId, email }) {
  return (
    <form
      action={adminDeleteUser}
      onSubmit={(e) => {
        if (!window.confirm(`Delete ${email} and ALL their QR codes and scan data? Their printed codes will go dead. This cannot be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="userId" value={userId} />
      <button className="text-sm font-medium text-bad hover:underline">
        Delete this user permanently
      </button>
    </form>
  );
}
