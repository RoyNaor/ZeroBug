'use client';

import React from 'react';
import { Button } from '@radix-ui/themes';
import Link from 'next/link';

function IssuePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-2xl font-bold mb-6">Issues</h1>
      <Link href="/issues/new">
        <Button size="3" color="blue">Create New Issue</Button>
      </Link>
    </div>
  );
}

export default IssuePage