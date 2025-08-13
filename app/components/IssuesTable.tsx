'use client';

import NextLink from "next/link";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button} from "@heroui/react";

type Issue = {
  id: number | string;
  title: string;
  description?: string | null;
  status: "OPEN" | "IN_PROGRESS" | "CLOSED";
  createdAtISO: string;           
};

const dateFmt = new Intl.DateTimeFormat("en-GB", { 
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "UTC",               
});

export default function IssuesTable({ issues }: { issues: Issue[] }) {
  const statusColor = { OPEN: "warning", IN_PROGRESS: "primary", CLOSED: "success" } as const;

  return (
    <Table aria-label="Issues table" removeWrapper shadow="none"
      className="rounded-2xl border border-gray-200 bg-white"
      classNames={{ th: "bg-gray-50 text-gray-700 font-semibold", td: "text-gray-800", tr: "hover:bg-gray-50/60" }}>
      <TableHeader>
        <TableColumn className="w-[55%]">TITLE</TableColumn>
        <TableColumn>STATUS</TableColumn>
        <TableColumn>CREATED</TableColumn>
        <TableColumn className="text-right">ACTIONS</TableColumn>
      </TableHeader>
      <TableBody emptyContent={<div className="text-gray-500 py-10">No issues yet. Create your first one!</div>}>
        {issues.map(issue => (
          <TableRow key={String(issue.id)}>
            <TableCell className="font-medium">
              <NextLink href={`/issues/${issue.id}`} className="text-blue-700 hover:underline">
                {issue.title}
              </NextLink>
              {issue.description && <div className="text-sm text-gray-500 line-clamp-1">{issue.description}</div>}
            </TableCell>
            <TableCell><Chip color={statusColor[issue.status]} variant="flat">{issue.status.replace("_"," ")}</Chip></TableCell>
            <TableCell className="text-gray-600">{dateFmt.format(new Date(issue.createdAtISO))}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button as={NextLink} href={`/issues/${issue.id}`} size="sm" variant="flat">View</Button>
                <Button as={NextLink} href={`/issues/${issue.id}/edit`} size="sm" color="primary" variant="flat">Edit</Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
