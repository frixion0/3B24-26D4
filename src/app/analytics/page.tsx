
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Users, Image as ImageIcon, FileText } from "lucide-react";
import { Icons } from "@/components/icons";

interface LogEntry {
  chatId: number;
  username: string;
  firstName: string;
  lastName: string;
  text: string;
  timestamp: string;
}

interface UserAnalytics {
  id: number;
  name: string;
  username: string;
  promptCount: number;
  prompts: { text: string; timestamp: string }[];
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<UserAnalytics[]>([]);
  const [totalPrompts, setTotalPrompts] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rawLogs, setRawLogs] = useState('');
  const [isRawLogsLoading, setIsRawLogsLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/analytics");
        if (!response.ok) {
          throw new Error("Failed to fetch analytics data.");
        }
        const logs: LogEntry[] = await response.json();

        if (logs.length === 0) {
            setAnalytics([]);
            setTotalPrompts(0);
            setTotalUsers(0);
            setIsLoading(false);
            return;
        }

        const userMap: { [key: number]: UserAnalytics } = {};
        logs.forEach(log => {
            if (!userMap[log.chatId]) {
                userMap[log.chatId] = {
                    id: log.chatId,
                    name: `${log.firstName || ''} ${log.lastName || ''}`.trim(),
                    username: log.username || 'N/A',
                    promptCount: 0,
                    prompts: []
                };
            }
            userMap[log.chatId].promptCount++;
            userMap[log.chatId].prompts.push({ text: log.text, timestamp: log.timestamp });
        });

        const sortedAnalytics = Object.values(userMap).sort((a, b) => b.promptCount - a.promptCount);
        
        setAnalytics(sortedAnalytics);
        setTotalPrompts(logs.length);
        setTotalUsers(Object.keys(userMap).length);

      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    }

    async function fetchRawLogs() {
      setIsRawLogsLoading(true);
      try {
        const res = await fetch('/api/analytics/raw');
        if (!res.ok) {
          setRawLogs('Failed to load raw logs.');
          return;
        }
        const text = await res.text();
        setRawLogs(text || 'Log file is empty.');
      } catch (e) {
        setRawLogs('An error occurred while fetching raw logs.');
      } finally {
        setIsRawLogsLoading(false);
      }
    }

    fetchLogs();
    fetchRawLogs();
  }, []);
  
  const renderStatsCards = () => {
    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Images Generated</CardTitle>
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-8 w-1/4" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-8 w-1/4" />
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Images Generated</CardTitle>
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalPrompts}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalUsers}</div>
                </CardContent>
            </Card>
        </div>
    );
  }

  const renderTableBody = () => {
    if (isLoading) {
      return (
        <Table>
          <TableBody>
            {Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={3}>
                  <Skeleton className="h-8 w-full" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }

    if (error) {
      return (
        <Table>
          <TableBody>
            <TableRow>
              <TableCell colSpan={3} className="text-center text-destructive">
                {error}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
    }

    if (analytics.length === 0) {
      return (
        <Table>
          <TableBody>
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground py-12">
                No bot activity has been logged yet.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
    }

    return analytics.map((user) => (
      <Accordion type="single" collapsible className="w-full" key={user.id}>
        <AccordionItem value={`user-${user.id}`} className="border-b-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/50">
                <TableCell className="font-semibold w-1/3">{user.name}</TableCell>
                <TableCell className="font-semibold w-1/3">@{user.username}</TableCell>
                <TableCell className="font-semibold w-1/3 flex items-center justify-between">
                  <span>{user.promptCount} Images</span>
                  <AccordionTrigger className="p-0 hover:no-underline [&[data-state=open]>svg]:text-primary" />
                </TableCell>
              </TableRow>
            </TableHeader>
          </Table>
          <AccordionContent>
            <div className="border-t max-h-60 overflow-y-auto">
              <Table>
                <TableBody>
                  {user.prompts.map((p, i) => (
                    <TableRow key={i} className="bg-muted/10">
                      <TableCell className="text-muted-foreground truncate max-w-sm">{p.text}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{new Date(p.timestamp).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    ));
  };
  
  const renderRawLogs = () => {
    return (
       <Card>
         <CardHeader>
           <CardTitle>Raw Log Data</CardTitle>
         </CardHeader>
         <CardContent>
           <Accordion type="single" collapsible className="w-full">
             <AccordionItem value="raw-logs">
               <AccordionTrigger className="text-sm font-semibold">
                 <div className="flex items-center gap-2">
                   <FileText className="h-4 w-4" />
                   <span>View Raw Logs</span>
                 </div>
               </AccordionTrigger>
               <AccordionContent>
                 <pre className="mt-4 max-h-96 overflow-auto rounded-md bg-muted p-4 text-xs font-mono text-muted-foreground">
                   {isRawLogsLoading ? <Skeleton className="h-24 w-full" /> : <code>{rawLogs}</code>}
                 </pre>
               </AccordionContent>
             </AccordionItem>
           </Accordion>
         </CardContent>
       </Card>
    );
  };

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
        <div className="container mx-auto space-y-6">
          {renderStatsCards()}

          <Card>
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {renderTableBody()}
            </CardContent>
          </Card>

          {renderRawLogs()}
        </div>
      </main>
    </div>
  );
}
