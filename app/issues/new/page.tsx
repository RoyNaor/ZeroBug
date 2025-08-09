'use client';

import { TextField, Button, Card, TextArea } from '@radix-ui/themes';
import React from 'react';

function NewIssuePage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] bg-gray-50">
      <Card className="w-full max-w-md p-8 shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center">Create New Issue</h2>
        <form className="space-y-5">
          <TextField.Root placeholder="Title" className="w-full">
            <TextField.Slot  />
          </TextField.Root>
            <TextArea placeholder="Description" />
          <Button type="submit" className="w-full">Submit</Button>
        </form>
      </Card>
    </div>
  );
}

export default NewIssuePage