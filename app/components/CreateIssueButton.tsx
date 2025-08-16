'use client';

import React, {useEffect, useTransition} from 'react';
import {Button} from '@heroui/react';
import {useRouter} from 'next/navigation';

export default function CreateIssueButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    router.prefetch?.('/issues/new');
  }, [router]);

  const go = () => {
    startTransition(() => {
      router.push('/issues/new');
    });
  };

  return (
    <Button
      color="primary"
      variant="shadow"
      onPress={go}
      isLoading={isPending}            
      disabled={isPending}
      className="min-w-44"
    >
      {isPending ? 'Opening…' : 'Create New Issue'}
    </Button>
  );
}
