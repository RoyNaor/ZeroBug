// app/components/IssuesTablePro.tsx
'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import NextLink from 'next/link';
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Input, Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem,
  Chip, Pagination
} from '@heroui/react';

type Issue = {
  id: number | string;
  title: string;
  description?: string | null;
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
  createdAtISO: string;
  assignee?: { name?: string | null; email?: string | null; image?: string | null } | null;
};

type Props = { issues: Issue[] };

const columns = [
  { name: 'TITLE', uid: 'title', sortable: true },
  { name: 'STATUS', uid: 'status', sortable: true },
  { name: 'CREATED', uid: 'created', sortable: true },
  { name: 'ACTIONS', uid: 'actions' },
] as const;

const statusOptions = [
  { name: 'Open', uid: 'OPEN' },
  { name: 'In progress', uid: 'IN_PROGRESS' },
  { name: 'Closed', uid: 'CLOSED' },
] as const;

const statusColor = { OPEN: 'warning', IN_PROGRESS: 'primary', CLOSED: 'success' } as const;

const dateFmt = new Intl.DateTimeFormat('en-GB', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: 'UTC',
});

const ChevronDownIcon = ({ strokeWidth = 1.5, ...props }: any) => (
  <svg viewBox="0 0 24 24" height="1em" width="1em" {...props}>
    <path
      d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      fill="none"
    />
  </svg>
);

const VerticalDotsIcon = (props: any) => (
  <svg viewBox="0 0 24 24" height="1em" width="1em" {...props}>
    <path
      d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
      fill="currentColor"
    />
  </svg>
);

const SearchIcon = (props: any) => (
  <svg viewBox="0 0 24 24" height="1em" width="1em" {...props}>
    <path
      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 22L20 20"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function IssuesTableProInner({ issues }: Props) {
  const [filterValue, setFilterValue] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'all' | Set<string>>('all');
  const [visibleColumns, setVisibleColumns] = React.useState<Set<string>>(
    new Set(['title', 'status', 'created', 'actions'])
  );
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(1);
  const [selectedKeys, setSelectedKeys] = React.useState<Set<string | number>>(new Set([]));
  const [sortDescriptor, setSortDescriptor] = React.useState<{
    column: string; direction: 'ascending' | 'descending'
  }>({ column: 'created', direction: 'descending' });

  const hasSearch = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if ((visibleColumns as any) === 'all') return columns;
    return columns.filter((c) => Array.from(visibleColumns).includes(c.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let data = [...issues];

    if (hasSearch) {
      const q = filterValue.toLowerCase();
      data = data.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          (i.description ?? '').toLowerCase().includes(q) ||
          String(i.id).includes(q)
      );
    }

    if (statusFilter !== 'all' && Array.from(statusFilter).length) {
      data = data.filter((i) => Array.from(statusFilter).includes(i.status));
    }

    return data;
  }, [issues, filterValue, statusFilter, hasSearch]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

  const pageItems = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [filteredItems, page, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...pageItems].sort((a, b) => {
      let first: any;
      let second: any;

      switch (sortDescriptor.column) {
        case 'title':
          first = a.title.toLowerCase();
          second = b.title.toLowerCase();
          break;
        case 'status':
          first = a.status;
          second = b.status;
          break;
        case 'created':
          first = new Date(a.createdAtISO).getTime();
          second = new Date(b.createdAtISO).getTime();
          break;
        default:
          first = (a as any)[sortDescriptor.column];
          second = (b as any)[sortDescriptor.column];
      }
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === 'descending' ? -cmp : cmp;
    });
  }, [pageItems, sortDescriptor]);

  const renderCell = React.useCallback((item: Issue, columnKey: string) => {
    switch (columnKey) {
      case 'title':
        return (
          <div className="flex flex-col">
            <NextLink href={`/issues/${item.id}`} className="text-blue-600 hover:underline font-medium">
              {item.title}
            </NextLink>
            {item.description && (
              <span className="text-xs text-default-500 line-clamp-1">{item.description}</span>
            )}
          </div>
        );
      case 'status':
        return (
          <Chip size="sm" variant="flat" color={statusColor[item.status]}>
            {item.status.replace('_', ' ')}
          </Chip>
        );
      case 'created':
        return <span className="text-default-500">{dateFmt.format(new Date(item.createdAtISO))}</span>;
      case 'actions':
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light" aria-label="Actions">
                  <VerticalDotsIcon className="text-default-400" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem as={NextLink} href={`/issues/${item.id}`} key="view">
                  View
                </DropdownItem>
                <DropdownItem as={NextLink} href={`/issues/${item.id}/edit`} key="edit">
                  Edit
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return null;
    }
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by title, description, or id…"
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => setFilterValue('')}
            onValueChange={(v) => {
              setFilterValue(v);
              setPage(1);
            }}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Status filter"
                closeOnSelect={false}
                selectedKeys={statusFilter as any}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter as any}
              >
                {statusOptions.map((s) => (
                  <DropdownItem key={s.uid} className="capitalize">
                    {s.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns as any}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns as any}
              >
                {columns.map((c) => (
                  <DropdownItem key={c.uid} className="capitalize">
                    {c.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <Button as={NextLink} href="/issues/new" color="primary">
              Add New
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {filteredItems.length} issues</span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="ml-1 bg-transparent outline-solid outline-transparent text-default-500 text-small"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [filterValue, statusFilter, visibleColumns, rowsPerPage, filteredItems.length]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === ('all' as any)
            ? 'All items selected'
            : `${(selectedKeys as Set<any>).size} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={Math.max(1, pages)}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={page <= 1}
            size="sm"
            variant="flat"
            onPress={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <Button
            isDisabled={page >= Math.max(1, pages)}
            size="sm"
            variant="flat"
            onPress={() => setPage((p) => Math.min(Math.max(1, pages), p + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, page, pages]);

  return (
    <Table
      isHeaderSticky
      aria-label="Issues table"
      topContent={topContent}
      topContentPlacement="outside"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      selectionMode="multiple"
      selectedKeys={selectedKeys as any}
      onSelectionChange={setSelectedKeys as any}
      sortDescriptor={sortDescriptor as any}
      onSortChange={setSortDescriptor as any}
      classNames={{ wrapper: 'max-h-[560px]' }}
    >
      <TableHeader columns={headerColumns as any}>
        {(column: any) => (
          <TableColumn
            key={column.uid}
            allowsSorting={column.sortable}
            align={column.uid === 'actions' ? 'center' : 'start'}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={sortedItems} emptyContent="No issues found">
        {(item: Issue) => (
          <TableRow key={String(item.id)}>
            {(columnKey) => <TableCell>{renderCell(item, String(columnKey))}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

// Export client-only to avoid hydration mismatch with internal data-keys
export default dynamic(() => Promise.resolve(IssuesTableProInner), { ssr: false });
