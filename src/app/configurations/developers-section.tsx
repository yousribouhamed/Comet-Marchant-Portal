"use client";

import type { FC } from "react";
import {
    BookOpen01,
    Check,
    Copy01,
    Database01,
    Download01,
    LinkExternal01,
    Server04,
} from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { useClipboard } from "@/hooks/use-clipboard";
import { cx } from "@/utils/cx";

const SUBSCRIPTION_KEY = "a8e2ed75c0d642e3aea97d4e2c1b88f0";
const BASE_URL = "https://ahoy-prod-comet-apim.azure-api.net/ecommerce";

type Integration = {
    id: string;
    name: string;
    path: string;
} & (
    | {
          logoSrc: string;
          icon?: never;
          color?: never;
      }
    | {
          logoSrc?: never;
          icon: FC<{ className?: string }>;
          color: "brand" | "success" | "warning" | "gray";
      }
);

const integrations: Integration[] = [
    { id: "shopify", name: "Shopify", logoSrc: "/integrations/shopify-logo.svg", path: "shopifyorders" },
    { id: "system", name: "System", icon: Server04, color: "gray", path: "smartorder" },
    { id: "woocommerce", name: "WooCommerce", logoSrc: "/integrations/woocommerce-logo.svg", path: "woocommerceorders" },
    { id: "magento", name: "Magento", logoSrc: "/integrations/magento-logo.svg", path: "magentoorders" },
];

const resources = [
    {
        id: "portal",
        title: "API Portal",
        description: "Browse all delivery endpoints, parameters, and example responses.",
        icon: BookOpen01,
        color: "brand" as const,
        cta: "Open portal",
    },
    {
        id: "sandbox",
        title: "API Sandbox",
        description: "Test requests against a sandbox environment — no live data affected.",
        icon: Database01,
        color: "warning" as const,
        cta: "Open sandbox",
    },
];

const buildUrl = (path: string) => `${BASE_URL}/${path}?subscriptionkey=${SUBSCRIPTION_KEY}`;

const CopyField = ({ value, label, id }: { value: string; label: string; id: string }) => {
    const { copied, copy } = useClipboard();
    const isCopied = copied === id;

    return (
        <div className="flex w-full items-center gap-2 rounded-lg border border-secondary bg-secondary_subtle px-3 py-2">
            <code className="min-w-0 flex-1 truncate font-mono text-sm text-secondary" title={value} aria-label={label}>
                {value}
            </code>
            <Button
                size="sm"
                color="secondary"
                iconLeading={isCopied ? Check : Copy01}
                onClick={() => copy(value, id)}
                className={cx("shrink-0", isCopied && "text-success-primary")}
            >
                {isCopied ? "Copied" : "Copy"}
            </Button>
        </div>
    );
};

export const DevelopersSection = () => {
    return (
        <div className="flex flex-col gap-8">
            <section className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-semibold text-primary">API endpoints</h3>
                    <p className="text-sm text-tertiary">
                        Use these URLs to push orders from each platform into the delivery pipeline.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {integrations.map((integration) => {
                        const url = buildUrl(integration.path);
                        return (
                            <div
                                key={integration.id}
                                className="flex flex-col gap-4 rounded-2xl border border-secondary bg-primary p-5 shadow-xs"
                            >
                                <div className="flex items-center gap-3">
                                    {"logoSrc" in integration ? (
                                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-secondary bg-primary p-2">
                                            <img
                                                src={integration.logoSrc}
                                                alt={`${integration.name} logo`}
                                                className="max-h-full max-w-full object-contain"
                                            />
                                        </span>
                                    ) : (
                                        <FeaturedIcon icon={integration.icon} color={integration.color} theme="light" size="sm" />
                                    )}
                                    <h4 className="text-md font-semibold text-primary">{integration.name}</h4>
                                </div>
                                <CopyField value={url} label={`${integration.name} endpoint URL`} id={integration.id} />
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
                {resources.map((resource) => (
                    <a
                        key={resource.id}
                        href="#"
                        className="group flex flex-col gap-4 rounded-2xl border border-secondary bg-primary p-5 shadow-xs transition duration-100 ease-linear hover:border-brand"
                    >
                        <div className="flex items-center justify-between">
                            <FeaturedIcon icon={resource.icon} color={resource.color} theme="light" size="md" />
                            <LinkExternal01
                                className="size-4 text-fg-quaternary transition-inherit-all group-hover:text-fg-brand-primary"
                                aria-hidden="true"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <h4 className="text-md font-semibold text-primary">{resource.title}</h4>
                            <p className="text-sm text-tertiary">{resource.description}</p>
                        </div>
                        <span className="text-sm font-semibold text-brand-secondary group-hover:text-brand-secondary_hover">
                            {resource.cta} →
                        </span>
                    </a>
                ))}

                <a
                    href="#"
                    className="group flex flex-col gap-4 rounded-2xl border border-brand bg-brand-primary_alt p-5 shadow-xs transition duration-100 ease-linear hover:bg-brand-secondary"
                >
                    <div className="flex items-center justify-between">
                        <FeaturedIcon icon={Download01} color="brand" theme="dark" size="md" />
                        <LinkExternal01 className="size-4 text-fg-brand-primary" aria-hidden="true" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <h4 className="text-md font-semibold text-primary">Download documentation</h4>
                        <p className="text-sm text-tertiary">Full delivery API reference as a PDF — useful offline.</p>
                    </div>
                    <span className="text-sm font-semibold text-brand-secondary">Download PDF →</span>
                </a>
            </section>
        </div>
    );
};
