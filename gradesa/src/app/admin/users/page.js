"use client";

import { Column, Row } from "@/components/ui/layout/container";
import useQuery from "@/shared/hooks/useQuery";
import { useRequest } from "@/shared/hooks/useRequest";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useIsSuperAdmin, useUser } from "@/context/user.context";
import { useRouter } from "next/navigation";

/**
 * UsersPage
 *
 * Superadmin-only UI for viewing registered users and changing whether a user
 * has teacher/admin rights.
 *
 * This page is intentionally separate from the normal teacher/admin flow:
 * - teachers/admins must not see this page
 * - only superadmins may access it
 */
export default function UsersPage() {
  const router = useRouter();
  const { auth } = useUser();
  const isSuperAdmin = useIsSuperAdmin();

  const { data: users, error, isLoading, refetch } = useQuery("/admin/users");

  const makeRequest = useRequest();
  const [updatingId, setUpdatingId] = useState(null);
  const [search, setSearch] = useState("");

  /**
   * Redirect unauthorized users away from this page.
   *
   * The `useIsSuperAdmin` hook already performs route protection logic,
   * but this extra redirect keeps the page behavior explicit and prevents
   * the user from remaining on `/admin/users` after losing access.
   */
  useEffect(() => {
    if (isSuperAdmin === false) {
      router.replace("/");
    }
  }, [isSuperAdmin, router]);

  /**
   * Filter users by username or email.
   *
   * Search is case-insensitive and updates client-side without an extra API call.
   */
  const filteredUsers = useMemo(() => {
    if (!users) return [];

    const searchTerm = search.trim().toLowerCase();
    if (!searchTerm) return users;

    return users.filter((user) => {
      return (
        user.username?.toLowerCase().includes(searchTerm) ||
        user.email?.toLowerCase().includes(searchTerm)
      );
    });
  }, [users, search]);

  // Wait until the superadmin check has resolved before rendering the page.
  if (isSuperAdmin === undefined) {
    return <p>Wird geladen...</p>;
  }

  if (isLoading) {
    return <p>Wird geladen...</p>;
  }

  if (error) {
    return <p className="error">Fehler beim Laden der Benutzer</p>;
  }

  /**
   * Toggle a user's teacher/admin status.
   *
   * Current role model:
   * - `is_admin = false` => Student
   * - `is_admin = true`  => Lehrer
   *
   * Superadmin status is intentionally not changed from this UI.
   */
  const handleRoleChange = async (user) => {
    try {
      setUpdatingId(user.id);

      await makeRequest(
        "/admin/users",
        {
          id: user.id,
          is_admin: !user.is_admin,
        },
        {
          method: "PATCH",
        }
      );

      // Refresh the list after a successful role update so UI stays in sync.
      await refetch();
    } catch (error) {
      console.error("Error updating user role:", error);
      alert("Fehler beim Aktualisieren der Benutzerrolle");
    } finally {
      setUpdatingId(null);
    }
  };

  /**
   * Return the display role used in the current UI model.
   */
  const getRoleLabel = (user) => {
    if (user.is_superadmin) return "Administrator";
    if (user.is_admin) return "Lehrer";
    return "Student";
  };

  /**
   * Prevent the current superadmin from changing their own role.
   *
   * This avoids accidental self-demotion, which could remove access to
   * user management and other privileged actions.
   */
  const isOwnAccount = (user) => {
    return String(user.id) === String(auth.user?.id);
  };

  return (
    <Column gap="md" width="100%">
      <Row justify="space-between" gap="xl" width="100%" align="center">
        <h2>Benutzerverwaltung</h2>
      </Row>

      <label>
        Benutzer suchen
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Nach Benutzername oder E-Mail suchen"
        />
      </label>

      {filteredUsers.length === 0 ? (
        <p>Keine Benutzer gefunden.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "12px" }}>
                  Benutzername
                </th>
                <th style={{ textAlign: "left", padding: "12px" }}>E-Mail</th>
                <th style={{ textAlign: "left", padding: "12px" }}>Rolle</th>
                <th style={{ textAlign: "left", padding: "12px" }}>Aktion</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const ownAccount = isOwnAccount(user);

                return (
                  <tr
                    key={user.id}
                    style={{ borderTop: "1px solid var(--color-border, #ddd)" }}
                  >
                    <td style={{ padding: "12px" }}>{user.username}</td>
                    <td style={{ padding: "12px" }}>{user.email}</td>
                    <td style={{ padding: "12px" }}>{getRoleLabel(user)}</td>
                    <td style={{ padding: "12px" }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRoleChange(user)}
                        disabled={
                          updatingId === user.id ||
                          user.is_superadmin ||
                          ownAccount
                        }
                      >
                        {ownAccount
                          ? "Eigener Account"
                          : user.is_superadmin
                            ? "Administrator"
                            : updatingId === user.id
                              ? "Wird aktualisiert..."
                              : user.is_admin
                                ? "Zu Student machen"
                                : "Zu Lehrer machen"}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Column>
  );
}
