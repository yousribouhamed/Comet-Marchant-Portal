"use client";

import { Tab, TabList, TabPanel, Tabs } from "@/components/application/tabs/tabs";
import { AddressBookSection } from "./address-book-section";
import { DevelopersSection } from "./developers-section";
import { LocationsSection } from "./locations-section";
import { ManageRolesSection } from "./manage-roles-section";
import { PaymentSettingsSection } from "./payment-settings-section";
import { PricingSection } from "./pricing-section";
import { ReturnPolicySection } from "./return-policy-section";

const tabs = [
    { id: "plans", label: "Plans" },
    { id: "custom-sms", label: "Custom SMS" },
    { id: "return-policy", label: "Return policy" },
    { id: "payment-settings", label: "Payment settings" },
    { id: "locations", label: "Locations" },
    { id: "cloud-telephony", label: "Cloud telephony" },
    { id: "address-book", label: "Address book" },
    { id: "manage-roles", label: "Manage roles" },
    { id: "developers", label: "Developers" },
];

export default function ConfigurationsPage() {
    return (
        <div className="flex flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
            <header className="flex flex-col gap-1">
                <h1 className="text-display-xs font-semibold text-primary md:text-display-sm">Configurations</h1>
                <p className="text-md text-tertiary">Manage your account, billing, and workspace settings.</p>
            </header>

            <Tabs defaultSelectedKey="plans">
                <TabList type="button-border" size="md" items={tabs}>
                    {(tab) => <Tab id={tab.id}>{tab.label}</Tab>}
                </TabList>

                <TabPanel id="plans" className="mt-8">
                    <PricingSection />
                </TabPanel>

                <TabPanel id="manage-roles" className="mt-8">
                    <ManageRolesSection />
                </TabPanel>

                <TabPanel id="developers" className="mt-8">
                    <DevelopersSection />
                </TabPanel>

                <TabPanel id="address-book" className="mt-8">
                    <AddressBookSection />
                </TabPanel>

                <TabPanel id="locations" className="mt-8">
                    <LocationsSection />
                </TabPanel>

                <TabPanel id="payment-settings" className="mt-8">
                    <PaymentSettingsSection />
                </TabPanel>

                <TabPanel id="return-policy" className="mt-8">
                    <ReturnPolicySection />
                </TabPanel>

                {tabs
                    .filter(
                        (tab) =>
                            tab.id !== "plans" &&
                            tab.id !== "manage-roles" &&
                            tab.id !== "developers" &&
                            tab.id !== "address-book" &&
                            tab.id !== "locations" &&
                            tab.id !== "payment-settings" &&
                            tab.id !== "return-policy",
                    )
                    .map((tab) => (
                        <TabPanel key={tab.id} id={tab.id} className="mt-8">
                            <div className="flex min-h-64 flex-col items-start gap-2 rounded-xl border border-secondary bg-primary p-6">
                                <h2 className="text-lg font-semibold text-primary">{tab.label}</h2>
                                <p className="text-sm text-tertiary">{tab.label} configuration content goes here.</p>
                            </div>
                        </TabPanel>
                    ))}
            </Tabs>
        </div>
    );
}
