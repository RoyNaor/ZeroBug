"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  User as HeroUser,
  Spinner,
} from "@heroui/react";
import { FiUser } from "react-icons/fi";

type User = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
};

type AssigneeSelectProps = {
  value?: string | null;
  onChange?: (user: User | null) => void;
  endpoint?: string;
  placeholder?: string;
  disabled?: boolean;
};

export default function AssigneeSelect({
  value = null,
  onChange,
  endpoint = "/api/users",
  placeholder = "Assign user",
  disabled,
}: AssigneeSelectProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(value);

  useEffect(() => setSelectedId(value ?? null), [value]);

  useEffect(() => {
    const source = axios.CancelToken.source();
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const { data } = await axios.get<User[]>(endpoint, {
          cancelToken: source.token,
          // prevent axios from caching in some browsers
          headers: { "Cache-Control": "no-cache" },
        });
        setUsers(data);
      } catch (e: any) {
        if (axios.isCancel(e)) return;
        console.error(e);
        setErr("Failed to load users");
      } finally {
        setLoading(false);
      }
    })();
    return () => source.cancel("component unmounted");
  }, [endpoint]);

  const selectedUser = useMemo(
    () => users.find((u) => u.id === selectedId) ?? null,
    [users, selectedId]
  );

  const handleAction = (key: React.Key) => {
    const id = String(key);
    setSelectedId(id);
    onChange?.(users.find((u) => u.id === id) ?? null);
  };

  return (
    <Dropdown placement="bottom-start" isDisabled={disabled || loading}>
      <DropdownTrigger>
        <Button
          variant="bordered"
          radius="lg"
          className="min-w-[220px] justify-start"
          isDisabled={disabled}
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Spinner size="sm" />
              Loading users…
            </span>
          ) : selectedUser ? (
            <HeroUser
              name={selectedUser.name ?? selectedUser.email ?? "User"}
              description={selectedUser.email ?? undefined}
              className="text-left"
              avatarProps={{
                // If image is null/empty, HeroUI will show the fallback below
                src: selectedUser.image ?? undefined,
                radius: "full",
                size: "sm",
                fallback: <FiUser className="text-gray-500" />,
              }}
            />
          ) : (
            <span className="inline-flex items-center gap-2 text-gray-700">
              <FiUser />
              {placeholder}
            </span>
          )}
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        aria-label="Users"
        selectionMode="single"
        selectedKeys={selectedId ? new Set([selectedId]) : new Set()}
        onAction={handleAction}
        emptyContent={
          err ? <span className="text-danger">{err}</span> : "No users found"
        }
        className="max-h-80 overflow-auto min-w-[260px]"
      >
        {users.map((u) => (
          <DropdownItem key={u.id} textValue={u.name ?? u.email ?? "User"}>
            <HeroUser
              name={u.name ?? u.email ?? "User"}
              description={u.email ?? undefined}
              className="text-left"
              avatarProps={{
                src: u.image ?? undefined,       // shows avatar if present
                radius: "full",
                size: "sm",
                fallback: <FiUser className="text-gray-500" />, // …else fallback icon
              }}
            />
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
