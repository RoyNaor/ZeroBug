// app/issues/[id]/page.tsx
import { prisma } from '@/prisma/client';
import Link from 'next/link';
import {
  Card, CardHeader, CardBody, CardFooter, Divider, Chip, Button, Tooltip,
} from '@heroui/react';
import { notFound } from 'next/navigation';
import { AiFillBug } from 'react-icons/ai';
import DeleteIssueButton from './DeleteIssueButton';


interface Props {
  params: Promise<{ id: string }>; 
}

const statusColor: Record<'OPEN' | 'IN_PROGRESS' | 'CLOSED', 'warning' | 'primary' | 'success'> = {
  OPEN: 'warning',
  IN_PROGRESS: 'primary',
  CLOSED: 'success',
};

const fmt = new Intl.DateTimeFormat('en-GB', {
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit',
  timeZone: 'UTC',
});

export default async function IssueDetailPage(props: Props) {
  const { id } = await props.params;      
  const issueId = Number(id);
  if (!Number.isFinite(issueId)) notFound();

  const issue = await prisma.issue.findUnique({ where: { id: issueId } });
  if (!issue) notFound();

  return (
    <div className="min-h-[70vh] px-6 pt-10 bg-gradient-to-b from-blue-50 to-white">
      <div className="mx-auto max-w-4xl">
        <Card className="border border-gray-200 shadow-lg">
          <CardHeader className="flex items-center justify-between gap-3 py-6">
            <div className="flex items-center gap-3">
              <AiFillBug className="text-blue-600 text-3xl" />
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">{issue.title}</h1>
                <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
                  <span>ID: {issue.id}</span>
                </div>
              </div>
            </div>
            <Chip color={statusColor[issue.status]} variant="flat" size="md" className="font-medium">
              {issue.status.replace('_', ' ')}
            </Chip>
          </CardHeader>

          <Divider />

          <CardBody className="py-6">
            <h2 className="mb-2 text-sm font-semibold text-gray-700">Description</h2>
            {issue.description
              ? <p className="whitespace-pre-wrap leading-7 text-gray-800">{issue.description}</p>
              : <p className="italic text-gray-500">No description provided.</p>}
          </CardBody>

          <Divider />

          <CardFooter className="flex items-center justify-between gap-3 py-4">
            <div className="text-xs text-gray-500">
              <span>Created at: {fmt.format(issue.createdAt)} | </span>
              <span>Last updated: {fmt.format(issue.updatedAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Tooltip content="Back to Issues" closeDelay={0}>
                <Button as={Link} href="/issues" variant="flat">Back</Button>
              </Tooltip>
              <Tooltip content="Edit this issue" closeDelay={0}>
                <Button as={Link} href={`/issues/${issue.id}/edit`} color="primary" variant="shadow">
                  Edit
                </Button>
              </Tooltip>
              <DeleteIssueButton id={issue.id} />
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
