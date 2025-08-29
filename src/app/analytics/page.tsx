
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { Icons } from "@/components/icons";

interface LogEntry {
  chatId: number;
  username: string;
  firstName: string;
  lastName: string;
  text: string;
  timestamp: string;
}

export default function AnalyticsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLogs() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/analytics");
        if (!response.ok) {
          throw new Error("Failed to fetch analytics data.");
        }
        const data = await response.json();
        setLogs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchLogs();
  }, []);
  
  const renderTableBody = () => {
    if (isLoading) {
      return Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-[180px]" /></TableCell>
        </TableRow>
      ));
    }
    
    if (error) {
        return (
            <TableRow>
                <TableCell colSpan={4} className="text-center text-destructive">
                    {error}
                </TableCell>
            </TableRow>
        );
    }
    
    if (logs.length === 0) {
        return (
            <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No bot activity has been logged yet.
                </TableCell>
            </TableRow>
        );
    }
    
    return logs.map((log) => (
      <TableRow key={log.timestamp + log.chatId}>
        <TableCell>{log.firstName || ''} {log.lastName || ''}</TableCell>
        <TableCell>@{log.username || 'N/A'}</TableCell>
        <TableCell className="max-w-[300px] truncate">{log.text}</TableCell>
        <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
      </TableRow>
    ));
  }

  return (
    <div className="flex min-h-dvh w-full flex-col bg-background text-foreground">
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 md:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold" prefetch={false}>
                <Icons.logo className="h-6 w-6 text-primary" />
                <span className="text-lg font-headline">TeleImage Analytics</span>
            </Link>
            <Button asChild variant="outline">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>
            </Button>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="container mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Bot Usage Analytics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Username</TableHead>
                                    <TableHead>Prompt</TableHead>
                                    <TableHead>Timestamp</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {renderTableBody()}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </main>
    </div>
  );
}
