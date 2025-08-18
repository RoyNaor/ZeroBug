'use client';

import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Textarea,
  Divider,
  Alert,
  Spinner,
} from '@heroui/react';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { createIssueSchema } from '../../validationSchema';
import { z } from 'zod';

type IssueForm = z.infer<typeof createIssueSchema>;

export default function NewIssuePage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<IssueForm>({ resolver: zodResolver(createIssueSchema) });

  const onSubmit = async (data: IssueForm) => {
    try {
      setError('');
      await axios.post('/api/issues', data);
      reset();
      router.push('/issues');
    } catch {
      setError('Failed to create issue. Please try again.');
    }
  };

  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl shadow-sm border border-neutral-200 rounded-2xl">
        <CardHeader className="py-6">
          <div className="w-full">
            <p className="text-xs uppercase tracking-wider text-neutral-500">
              Issue
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-neutral-900">
              Create new issue
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Provide a concise title and a clear description.
            </p>
          </div>
        </CardHeader>

        <Divider className="bg-neutral-200" />

        <CardBody className="py-6">
          {error && (
            <Alert color="danger" title={error} className="mb-5" />
          )}

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Title */}
            <Input
              label="Title"
              placeholder="Short, clear title"
              variant="bordered"
              size="lg"
              isInvalid={!!errors.title}
              errorMessage={errors.title?.message}
              {...register('title', { required: 'Title is required' })}
              classNames={{
                label: 'text-neutral-700',
                inputWrapper:
                  'border-neutral-300 data-[hover=true]:border-neutral-400',
              }}
            />

            {/* Description */}
            <Textarea
              label="Description"
              placeholder="Describe the issue...."
              minRows={6}
              variant="bordered"
              size="lg"
              isInvalid={!!errors.description}
              errorMessage={errors.description?.message}
              {...register('description', { required: 'Description is required' })}
              classNames={{
                label: 'text-neutral-700',
                inputWrapper:
                  'border-neutral-300 data-[hover=true]:border-neutral-400',
              }}
            />

            <div className="pt-2">
              <Button
                type="submit"
                color="primary"
                size="lg"
                radius="lg"
                className="w-full font-semibold shadow-sm"
                isDisabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Spinner size="sm" color="white" />
                    Submitting…
                  </span>
                ) : (
                  'Submit issue'
                )}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
