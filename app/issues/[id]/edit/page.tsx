import { prisma } from '@/prisma/client';
import { notFound } from 'next/navigation';
import EditIssueForm from './EditIssueForm';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditIssuePage({ params }: Props) {
  const { id } = await params;
  const issueId = Number(id);
  if (Number.isNaN(issueId)) notFound();

  const issue = await prisma.issue.findUnique({ where: { id: issueId } });
  if (!issue) notFound();

  return <EditIssueForm issue={issue} />;
}
