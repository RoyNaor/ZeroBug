'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card, CardHeader, CardBody, CardFooter, Divider,
  Input, Textarea, Button, Chip, Select, SelectItem
} from '@heroui/react';
import { AiFillBug } from 'react-icons/ai';
import axios from 'axios';

type Issue = {
  id: number;
  title: string;
  description: string | null;
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
};

export default function EditIssueForm({ issue }: { issue: Issue }) {
  const router = useRouter();

  const [title, setTitle] = useState(issue.title);
  const [description, setDescription] = useState(issue.description ?? '');
  const [status, setStatus] = useState<Issue['status']>(issue.status);
  const [isSaving, setIsSaving] = useState(false);

  const statusColors = {
    OPEN: 'warning',
    IN_PROGRESS: 'primary',
    CLOSED: 'success',
  } as const;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await axios.patch(`/api/issues/${issue.id}`, { title, description, status });
      router.push(`/issues/${issue.id}`); 
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-[70vh] px-6 pt-10 bg-gradient-to-b from-blue-50 to-white">
      <div className="mx-auto max-w-3xl">
        <Card className="border border-gray-200 shadow-lg">
          <CardHeader className="flex items-center gap-3 py-6">
            <AiFillBug className="text-blue-600 text-3xl" />
            <h1 className="text-2xl font-semibold text-gray-900">
              Edit Issue #{issue.id}
            </h1>
          </CardHeader>

          <Divider />

          <form onSubmit={handleSubmit}>
            <CardBody className="py-6 space-y-6">
              <Input
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                variant="bordered"
                radius="lg"
                color="primary"
                required
              />

              <Textarea
                label="Description"
                minRows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                variant="bordered"
                radius="lg"
                color="primary"
              />

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Status
                </label>
                <Select
                    selectedKeys={[status]}        
                    onSelectionChange={(keys) =>
                        setStatus(Array.from(keys)[0] as Issue['status'])
                    }
                    className="max-w-xs"
                    variant="bordered"
                    radius="lg"
                    label="Status"
                    >
                    {(['OPEN', 'IN_PROGRESS', 'CLOSED'] as const).map((s) => (
                        <SelectItem key={s} textValue={s}>
                        <Chip color={statusColors[s]} variant="flat">
                            {s.replace('_', ' ')}
                        </Chip>
                        </SelectItem>
                    ))}
                    </Select>

              </div>
            </CardBody>

            <Divider />

            <CardFooter className="flex justify-end gap-3 py-4">
              <Button
                type="button"
                variant="flat"
                onClick={() => router.back()}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                color="primary"
                variant="shadow"
                isLoading={isSaving}
              >
                Save Changes
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
