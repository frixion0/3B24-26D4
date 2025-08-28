"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { generateImage, GenerateImageInput } from "@/ai/flows/generate-image-from-telegram-prompt";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "./ui/skeleton";
import { Badge } from "./ui/badge";

interface WebhookStatus {
  ok: boolean;
  url: string;
  has_custom_certificate: boolean;
  pending_update_count: number;
  last_error_date?: number;
  last_error_message?: string;
  max_connections?: number;
  ip_address?: string;
  expected_url: string;
}

export function LandingPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [webhookStatus, setWebhookStatus] = useState<WebhookStatus | null>(null);
  const [isStatusLoading, setIsStatusLoading] = useState(true);
  const [isSettingWebhook, setIsSettingWebhook] = useState(false);

  useEffect(() => {
    setYear(new Date().getFullYear());
    fetchWebhookStatus();
  }, []);
  
  const fetchWebhookStatus = async () => {
    setIsStatusLoading(true);
    try {
      const response = await fetch('/api/telegram/webhook-status');
      const data = await response.json();
      if (data.ok) {
        setWebhookStatus(data);
      } else {
        console.error("Failed to fetch webhook status:", data.error);
        setWebhookStatus(null);
      }
    } catch (error) {
      console.error("Error fetching webhook status:", error);
      setWebhookStatus(null);
    } finally {
      setIsStatusLoading(false);
    }
  };

  const handleSetWebhook = async () => {
    setIsSettingWebhook(true);
    try {
        const response = await fetch('/api/telegram/set-webhook', { method: 'POST' });
        const data = await response.json();
        if (data.ok) {
            toast({
                title: "Webhook Set!",
                description: "Your bot is now connected to Telegram.",
            });
            await fetchWebhookStatus();
        } else {
            toast({
                title: "Webhook Error",
                description: data.error || "An unknown error occurred.",
                variant: "destructive",
            });
        }
    } catch (error) {
        toast({
            title: "Webhook Error",
            description: "Failed to set the webhook. Check the console for details.",
            variant: "destructive",
        });
        console.error("Error setting webhook:", error);
    } finally {
        setIsSettingWebhook(false);
    }
  };


  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setGeneratedImage(null);
    try {
      const input: GenerateImageInput = { prompt };
      const result = await generateImage(input);
      setGeneratedImage(result.imageDataUri);
    } catch (error) {
      console.error("Failed to generate image:", error);
      toast({
        title: "Image Generation Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isWebhookConfigured = webhookStatus?.url === webhookStatus?.expected_url;

  return (
    <div className="flex min-h-dvh w-full flex-col bg-background text-foreground">
      <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 md:px-6">
        <Link href="#" className="flex items-center gap-2 font-semibold" prefetch={false}>
          <Icons.logo className="h-6 w-6 text-primary" />
          <span className="text-lg font-headline">TeleImage</span>
        </Link>
        <Button asChild>
          <Link href="https://t.me/fb_studio_test_bot" target="_blank" rel="noopener noreferrer">
            <Icons.send className="mr-2 h-4 w-4" />
            Open in Telegram
          </Link>
        </Button>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Turn Your Words into Art with TeleImage
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Unleash your creativity. Our Telegram bot uses cutting-edge AI to transform your text prompts into stunning, unique images. It&apos;s as simple as sending a message.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild>
                    <Link href="#generate" prefetch={false}>
                      <Icons.sparkles className="mr-2 h-5 w-5" />
                      Try it on the Web
                    </Link>
                  </Button>
                  <Button size="lg" variant="secondary" asChild>
                    <Link href="https://t.me/fb_studio_test_bot" target="_blank" rel="noopener noreferrer">
                      <Icons.bot className="mr-2 h-5 w-5" />
                      Use the Telegram Bot
                    </Link>
                  </Button>
                </div>
              </div>
              <Image
                src="https://picsum.photos/1200/800"
                width={1200}
                height={800}
                alt="Abstract art"
                data-ai-hint="surreal abstract art"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>

        <section id="generate" className="w-full bg-card py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                    <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">
                    Generate an Image
                    </h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Enter a prompt below and watch the AI bring your vision to life.
                    </p>
                </div>
            </div>
            <div className="mx-auto mt-8 max-w-2xl">
                <div className="flex gap-2">
                    <Input
                    type="text"
                    placeholder="e.g., 'A majestic lion wearing a crown'"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerateImage()}
                    disabled={isLoading}
                    />
                    <Button onClick={handleGenerateImage} disabled={isLoading}>
                        {isLoading ? 'Generating...' : 'Generate'}
                    </Button>
                </div>
            </div>

            <div className="mt-8 flex justify-center">
              {isLoading && (
                  <Skeleton className="h-[512px] w-[512px] rounded-lg" />
              )}
              {generatedImage && !isLoading && (
                  <Image
                  src={generatedImage}
                  alt={prompt}
                  width={512}
                  height={512}
                  className="rounded-lg object-contain"
                  />
              )}
            </div>
          </div>
        </section>

        <section id="features" className="w-full bg-background py-12 md:py-24 lg:py-32">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-secondary-foreground">
                  How It Works
                </div>
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">A Simple Process</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                You can generate images through our website, or with our intuitive Telegram bot.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
              <Card className="h-full bg-card transition-all hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Icons.bot className="h-8 w-8 text-primary" />
                    <span>1. Find the Bot</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Open Telegram and search for our TeleImage bot, or click any of the buttons on this page.
                  </p>
                </CardContent>
              </Card>
              <Card className="h-full bg-card transition-all hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Icons.send className="h-8 w-8 text-primary" />
                    <span>2. Send a Prompt</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Type and send any creative idea you have. For example, "a unicorn reading a book in a library".
                  </p>
                </CardContent>
              </Card>
              <Card className="h-full bg-card transition-all hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Icons.image className="h-8 w-8 text-primary" />
                    <span>3. Receive Your Image</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    In just a few moments, the bot will reply with your unique, AI-generated image.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="webhook-status" className="w-full bg-card py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">
                  Telegram Bot Status
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Check if the Telegram bot is correctly configured and connected.
                </p>
              </div>
            </div>
            <div className="mx-auto mt-8 max-w-2xl">
              <Card>
                <CardContent className="p-6">
                  {isStatusLoading ? (
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  ) : webhookStatus ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Webhook Status</h3>
                          {isWebhookConfigured ? (
                              <Badge variant="default" className="bg-green-500 hover:bg-green-600">Connected</Badge>
                          ) : (
                              <Badge variant="destructive">Not Connected</Badge>
                          )}
                      </div>
                      <div className="text-sm text-muted-foreground space-y-2">
                        <p>
                          <span className="font-semibold text-foreground">Webhook URL:</span>{" "}
                          <span className="break-all">{webhookStatus.url || "Not set"}</span>
                        </p>
                        <p>
                          <span className="font-semibold text-foreground">Expected URL:</span>{" "}
                          <span className="break-all">{webhookStatus.expected_url}</span>
                        </p>
                        <p>
                          <span className="font-semibold text-foreground">Pending Updates:</span>{" "}
                          {webhookStatus.pending_update_count}
                        </p>
                        {webhookStatus.last_error_message && (
                            <p className="text-destructive">
                                <span className="font-semibold">Last Error:</span>{" "}
                                {webhookStatus.last_error_message}
                            </p>
                        )}
                        {!isWebhookConfigured && (
                           <div className="text-amber-500 pt-4 flex flex-col items-center gap-4">
                            <p>
                              The webhook is not configured correctly. Click the button below to fix it.
                            </p>
                            <Button onClick={handleSetWebhook} disabled={isSettingWebhook}>
                              {isSettingWebhook ? 'Connecting...' : 'Connect to Telegram'}
                            </Button>
                           </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-destructive">
                      <p>Could not retrieve webhook status. Please check your TELEGRAM_BOT_TOKEN.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
        <p className="text-xs text-muted-foreground">&copy; {year} TeleImage. All rights reserved.</p>
        <nav className="flex gap-4 sm:ml-auto sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
