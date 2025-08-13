import { prisma } from "@/prisma/client";
import IssuesTable from "../components/IssuesTable";

export default async function IssuesPage() {
  const issues = await prisma.issue.findMany({ orderBy: { createdAt: "desc" } });

  const safeIssues = issues.map(i => ({
    ...i,
    createdAtISO: i.createdAt.toISOString(), 
  }));

  return (
    <div className="min-h-[70vh] px-6 pt-10 bg-gradient-to-b from-blue-50 to-white">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Issues</h1>
          <a href="/issues/new" className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition">
            Create New Issue
          </a>
        </div>
        <IssuesTable issues={safeIssues} />
      </div>
    </div>
  );
}
