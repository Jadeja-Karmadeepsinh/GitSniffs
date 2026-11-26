"use client";

import { ExternalLink, Unplug } from "lucide-react";

import type { GithubInstallationStatus } from "@/features/dashboard/lib/types";
import {
    statusBadge,
    statusButtonClass,
} from "@/features/dashboard/lib/status-style";
import { getGithubInstallUrl } from "@/features/github/utils/github-app";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { disconnectGithubApp } from "../actions/index";

function GitHubIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={cn("size-4 shrink-0", className)} aria-hidden fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
        </svg>
    );
}

type GithubConnectCardProps = {
    userId: string;
    installation: GithubInstallationStatus;
};

function ConnectedDetails({ accountLogin }: { accountLogin: string | null }) {
    return (
        <p className="text-xs text-muted-foreground">
            Installed for{" "}
            <span className="font-medium text-green-700 dark:text-green-400">
                @{accountLogin}
            </span>
            . The app can read repository metadata and post review comments on pull
            requests.
        </p>
    );
}

function DisconnectedDetails() {
    return (
        <ul className="list-inside list-disc space-y-1 text-xs text-muted-foreground">
            <li>Access public and private repositories you select</li>
            <li>Receive webhooks for pull request events</li>
            <li>Post AI-generated review comments on PRs</li>
        </ul>
    );
}

function ConnectedActions() {
    return (
        <form action={disconnectGithubApp}>
            <Button
                type="submit"
                variant="outline"
                className={statusButtonClass.danger}
            >
                <Unplug />
                Disconnect GitHub App
            </Button>
        </form>
    );
}

function DisconnectedActions({ installUrl }: { installUrl: string }) {
    return (
        <Button
            asChild
            className={statusButtonClass.success}
        >
            <a href={installUrl}>
                <GitHubIcon />
                Install GitHub App
                <ExternalLink className="size-3 opacity-80" />
            </a>
        </Button>
    );
}

function ConnectionDetails({
    connected,
    accountLogin,
}: {
    connected: boolean;
    accountLogin: string | null;
}) {
    if (connected) {
        return <ConnectedDetails accountLogin={accountLogin} />;
    }

    return <DisconnectedDetails />;
}

function ConnectionActions({
    connected,
    installUrl,
}: {
    connected: boolean;
    installUrl: string;
}) {
    if (connected) {
        return <ConnectedActions />;
    }

    return <DisconnectedActions installUrl={installUrl} />;
}

export function GithubConnectCard({
    userId,
    installation,
}: GithubConnectCardProps) {
    const { connected, accountLogin } = installation;
    // Install URL encodes userId so the callback can associate the installation
    const installUrl = getGithubInstallUrl(userId);

    // Default to neutral styling; switch to green when connected
    let cardBorderClass = "border-border";
    let iconWrapperClass = "border-border bg-muted";
    let statusTone: "success" | "neutral" = "neutral";
    let statusLabel = "Not connected";

    if (connected) {
        cardBorderClass = "border-green-500/30";
        iconWrapperClass =
            "border-green-500/40 bg-green-500/10 text-green-700 dark:text-green-400";
        statusTone = "success";
        statusLabel = "Connected";
    }

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <Card className={cn("max-w-2xl transition-colors", cardBorderClass)}>
                <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <span
                                className={cn(
                                    "flex size-10 items-center justify-center rounded-none border",
                                    iconWrapperClass
                                )}
                            >
                                <GitHubIcon className="size-5" />
                            </span>
                            <div>
                                <CardTitle>GitHub App</CardTitle>
                                <CardDescription>
                                    Install the GitSniffs app on your GitHub account or
                                    organization to access public and private repositories.
                                </CardDescription>
                            </div>
                        </div>
                        <span className={statusBadge(statusTone)}>{statusLabel}</span>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ConnectionDetails connected={connected} accountLogin={accountLogin} />
                </CardContent>
                <CardFooter className="flex flex-wrap gap-2">
                    <ConnectionActions connected={connected} installUrl={installUrl} />
                </CardFooter>
            </Card>
        </div>
    );
}
