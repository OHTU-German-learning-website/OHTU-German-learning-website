"use client";

import AdminLastModified from "@/components/ui/admin-last-modified";
import { checkIsAdmin } from "@/context/user.context";
import useQuery from "@/shared/hooks/useQuery";

export default function AdminVisibleLastModified({
  updatedAt,
  updatedBy,
  endpoint,
  className,
}) {
  const isAdmin = checkIsAdmin();
  const shouldFetch = isAdmin && !!endpoint;

  const { data } = useQuery(endpoint || "", null, {
    enabled: shouldFetch,
  });

  if (!isAdmin) {
    return null;
  }

  const resolvedUpdatedAt =
    updatedAt || data?.last_modified_at || data?.exercise?.last_modified_at;
  const resolvedUpdatedBy =
    updatedBy || data?.last_modified_by || data?.exercise?.last_modified_by;

  return (
    <AdminLastModified
      updatedAt={resolvedUpdatedAt}
      updatedBy={resolvedUpdatedBy}
      className={className}
    />
  );
}
