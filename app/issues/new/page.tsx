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
  Spinner
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
    } catch (error) {
      setError('Failed to create issue. Please try again.');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-white">
      <Card className="w-full max-w-xl shadow-lg border border-blue-100">
        <CardHeader className="flex flex-col items-center gap-2 py-6">
          <h2 className="text-3xl font-semibold bg-gradient-to-r from-blue-800 to-blue-500 bg-clip-text text-transparent">
            Create New Issue
          </h2>
          <p className="text-sm text-blue-600/80">
            Fill the details below and submit
          </p>
        </CardHeader>

        <Divider className="bg-blue-100" />

        <CardBody className="py-6 space-y-5">
          {/* Show error alert if there's an error */}
          {error && (
            <Alert color="danger" title={error} className="w-full" />
          )}

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Title */}
            <Input
              label="Title"
              placeholder="Short, clear title"
              radius="lg"
              variant="bordered"
              color="primary"
              isInvalid={!!errors.title}
              errorMessage={errors.title?.message}
              {...register('title', { required: 'Title is required' })}
              classNames={{
                inputWrapper:
                  'border-blue-200 data-[hover=true]:border-blue-300',
              }}
            />

            {/* Description */}
            <Textarea
              label="Description"
              placeholder="Describe the issue…"
              minRows={6}
              radius="lg"
              variant="bordered"
              color="primary"
              isInvalid={!!errors.description}
              errorMessage={errors.description?.message}
              {...register('description', {
                required: 'Description is required',
              })}
              classNames={{
                inputWrapper:
                  'border-blue-200 data-[hover=true]:border-blue-300',
              }}
            />

            <Button
                type="submit"
                color="primary"
                variant="shadow"
                radius="lg"
                className="w-full flex items-center justify-center"
                disabled={isSubmitting}
                >
                {isSubmitting ? (
                    <>
                    <Spinner size="sm" color="white" /> {/* Spinner */}
                    <span className="ml-2">Submitting…</span>
                    </>
                ) : (
                    "Submit Issue"
                )}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
