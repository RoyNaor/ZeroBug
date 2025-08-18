'use client';

import React from 'react';
import { Spinner } from '@heroui/react';

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[100vh] bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <Spinner
          size="lg"
          color="primary"
          label="Loading..."
          labelColor="primary"
          className="scale-150" // make spinner big
        />
      </div>
    </div>
  );
}
