"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";

export function LandingPage() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <div className="flex min-h-dvh w-full flex-col bg-background text-foreground">
      <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 md:px-6">
        <Link href="#" className="flex items-center gap-2 font-semibold" prefetch={false}>
          <Icons.logo className="h-6 w-6 text-primary" />
          <span className="text-lg font-headline">TeleImage</span>
        </Link>
        <Button asChild>
          <Link href="https://t.me/your_bot_username_here" target="_blank" rel="noopener noreferrer">
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
                    <Link href="https://t.me/your_bot_username_here" target="_blank" rel="noopener noreferrer">
                      <Icons.bot className="mr-2 h-5 w-5" />
                      Start Creating Now
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

        <section id="features" className="w-full bg-card py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-secondary-foreground">
                  How It Works
                </div>
                <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">
                  A Simple 3-Step Process
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Generating images has never been easier. Just follow these simple steps to get started.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
              <Card className="h-full bg-background transition-all hover:shadow-lg">
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
              <Card className="h-full bg-background transition-all hover:shadow-lg">
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
              <Card className="h-full bg-background transition-all hover:shadow-lg">
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
