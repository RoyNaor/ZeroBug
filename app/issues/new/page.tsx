'use client';

import { TextField, Button, Card } from '@radix-ui/themes';
import dynamic from 'next/dynamic';
import "easymde/dist/easymde.min.css";
import { useForm, Controller } from 'react-hook-form';

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), { ssr: false });

interface IssueForm {
  title: string;    
  description: string;
}

function NewIssuePage() {
    const { register, control, handleSubmit, formState: { errors } } = useForm<IssueForm>();

  return (
    <div className="flex items-center justify-center min-h-[60vh] bg-gray-50">
      <Card className="w-full max-w-md p-8 shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center">Create New Issue</h2>
        <form className="space-y-5" onSubmit={handleSubmit((data) => console.log('data:', data))}>
          <TextField.Root placeholder="Title" className="w-full">
            <TextField.Slot {...register('title')} />
          </TextField.Root>
          <Controller 
            name="description"
            control={control}
            render={({ field }) => (
              <SimpleMDE
                {...field}
                options={{
                  placeholder: "Description",
                  spellChecker: false,
                  autosave: {
                    enabled: true,
                    uniqueId: "issue-description",
                    delay: 1000,
                  },
                }}
              />
            )}
          />
          <Button type="submit" className="w-full">Submit</Button>
        </form>
      </Card>
    </div>
  );
}

export default NewIssuePage