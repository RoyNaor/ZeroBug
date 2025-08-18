// app/page.tsx (or app/(dashboard)/page.tsx)
'use client';

import React from 'react';
import NextLink from 'next/link';
import {
  Card, CardHeader, CardBody, CardFooter,
  Button, Chip, Divider, Skeleton,
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Progress,
} from '@heroui/react';

type Issue = {
  id: number;
  title: string;
  description?: string | null;
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
  createdAt: string; // ISO from API
  // optional if you later include it:
  assignee?: { name?: string | null; email?: string | null; image?: string | null } | null;
};

const statusColor = {
  OPEN: 'warning',
  IN_PROGRESS: 'primary',
  CLOSED: 'success',
} as const;

const dateFmt = new Intl.DateTimeFormat('en-GB', {
  year: 'numeric', month: '2-digit', day: '2-digit',
  timeZone: 'UTC',
});

export default function Home() {
  const [issues, setIssues] = React.useState<Issue[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    try {
      setError(null);
      const res = await fetch('/api/issues', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load issues');
      const data = await res.json();
      // Expecting a list; adapt if your API returns {items: [...]}
      setIssues(Array.isArray(data) ? data : data.items ?? []);
    } catch (e: any) {
      setError(e?.message ?? 'Something went wrong');
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const totals = React.useMemo(() => {
    const base = { total: 0, open: 0, inProgress: 0, closed: 0, unassigned: 0 };
    if (!issues) return base;
    for (const i of issues) {
      base.total++;
      if (i.status === 'OPEN') base.open++;
      if (i.status === 'IN_PROGRESS') base.inProgress++;
      if (i.status === 'CLOSED') base.closed++;
      if (!i.assignee) base.unassigned++;
    }
    return base;
  }, [issues]);

  const recent = React.useMemo(() => {
    if (!issues) return [];
    return [...issues]
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
      .slice(0, 6);
  }, [issues]);

  return (
    <div className="min-h-[70vh] p-6 md:p-8 bg-gradient-to-b from-blue-50 to-white">
      {/* Top: Heading + Actions */}
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">Overview of your issues at a glance.</p>
          </div>
          <div className="flex gap-3">
            <Button as={NextLink} href="/issues/new" color="primary" variant="shadow">
              New Issue
            </Button>
            <Button as={NextLink} href="/issues" variant="flat">
              View All
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="All Issues" value={issues ? totals.total : null} />
          <StatCard title="Open" value={issues ? totals.open : null} color="warning" />
          <StatCard title="In Progress" value={issues ? totals.inProgress : null} color="primary" />
          <StatCard title="Closed" value={issues ? totals.closed : null} color="success" />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Issues */}
          <Card className="lg:col-span-2 border border-gray-200">
            <CardHeader className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Recent Issues</h2>
                <p className="text-sm text-gray-500">Newest items from your tracker</p>
              </div>
              <Button as={NextLink} href="/issues" size="sm" variant="flat">See all</Button>
            </CardHeader>
            <Divider />
            <CardBody>
              {!issues && !error && <TableSkeleton rows={6} />}
              {error && (
                <div className="text-sm text-danger-500">{error}</div>
              )}
              {issues && !error && (
                <Table
                  aria-label="Recent issues"
                  removeWrapper
                  className="rounded-xl border border-gray-200 bg-white"
                  classNames={{
                    th: 'bg-gray-50 text-gray-700 font-medium',
                    td: 'text-gray-800',
                    tr: 'hover:bg-gray-50/60',
                  }}
                >
                  <TableHeader>
                    <TableColumn className="w-[55%]">TITLE</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                    <TableColumn>CREATED</TableColumn>
                    <TableColumn className="text-right">ACTIONS</TableColumn>
                  </TableHeader>
                  <TableBody
                    emptyContent={<div className="text-gray-500 py-8">No issues yet.</div>}
                  >
                    {recent.map((i) => (
                      <TableRow key={i.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <NextLink
                              href={`/issues/${i.id}`}
                              className="text-blue-600 hover:underline font-medium"
                            >
                              {i.title}
                            </NextLink>
                            {i.description && (
                              <span className="text-xs text-gray-500 line-clamp-1">
                                {i.description}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Chip size="sm" variant="flat" color={statusColor[i.status]}>
                            {i.status.replace('_', ' ')}
                          </Chip>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {dateFmt.format(new Date(i.createdAt))}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              as={NextLink}
                              href={`/issues/${i.id}`}
                              size="sm"
                              variant="flat"
                            >
                              View
                            </Button>
                            <Button
                              as={NextLink}
                              href={`/issues/${i.id}/edit`}
                              size="sm"
                              color="primary"
                              variant="flat"
                            >
                              Edit
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardBody>
          </Card>

          {/* Status Breakdown / Unassigned */}
          <Card className="border border-gray-200">
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Status Breakdown</h2>
            </CardHeader>
            <Divider />
            <CardBody className="space-y-4">
              {!issues ? (
                <div className="space-y-4">
                  <Skeleton className="rounded-lg h-5 w-full" />
                  <Skeleton className="rounded-lg h-5 w-full" />
                  <Skeleton className="rounded-lg h-5 w-full" />
                  <Skeleton className="rounded-lg h-5 w-full" />
                </div>
              ) : (
                <>
                  <Progress
                    label="Open"
                    value={totals.total ? (totals.open / totals.total) * 100 : 0}
                    color="warning"
                    showValueLabel
                  />
                  <Progress
                    label="In Progress"
                    value={totals.total ? (totals.inProgress / totals.total) * 100 : 0}
                    color="primary"
                    showValueLabel
                  />
                  <Progress
                    label="Closed"
                    value={totals.total ? (totals.closed / totals.total) * 100 : 0}
                    color="success"
                    showValueLabel
                  />
                  <Divider />
                  <div className="text-sm text-gray-600">
                    Unassigned:{' '}
                    <span className="font-medium text-gray-900">{issues ? totals.unassigned : '-'}</span>
                  </div>
                </>
              )}
            </CardBody>
            <CardFooter className="justify-end">
              <Button as={NextLink} href="/issues?filter=unassigned" size="sm" variant="flat">
                View unassigned
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ---------- Small subcomponents ---------- */

function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number | null;
  color?: 'primary' | 'success' | 'warning';
}) {
  return (
    <Card className="border border-gray-200">
      <CardBody className="py-5">
        <div className="text-sm text-gray-500">{title}</div>
        {value === null ? (
          <Skeleton className="h-7 w-20 rounded-lg mt-1" />
        ) : (
          <div className="mt-1 text-2xl font-semibold text-gray-900 flex items-center gap-2">
            {value}
            {typeof color !== 'undefined' && value > 0 && (
              <Chip size="sm" variant="flat" color={color}>
                {title}
              </Chip>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="grid grid-cols-12 gap-3">
          <Skeleton className="col-span-6 h-6 rounded-lg" />
          <Skeleton className="col-span-2 h-6 rounded-lg" />
          <Skeleton className="col-span-2 h-6 rounded-lg" />
          <Skeleton className="col-span-2 h-6 rounded-lg" />
        </div>
      ))}
    </div>
  );
}
