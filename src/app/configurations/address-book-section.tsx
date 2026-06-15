"use client";

import { useState } from "react";
import { CheckCircle, FileDownload01, InfoCircle, Map01, Shield01, UploadCloud02 } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { FileUpload, getReadableFileSize } from "@/components/application/file-upload/file-upload-base";
import { Table, TableCard } from "@/components/application/table/table";
import { TablePagination, useTablePagination } from "@/components/application/table/table-pagination";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { Illustration } from "@/components/shared-assets/illustrations";

type TemplateField = {
    id: string;
    name: string;
    requirement: "mandatory" | "optional" | "address-part";
    note: string;
};

const templateFields: TemplateField[] = [
    {
        id: "customer-name",
        name: "Customer Name",
        requirement: "mandatory",
        note: "Customer display name used while creating orders.",
    },
    {
        id: "customer-phone",
        name: "Customer Phone #",
        requirement: "mandatory",
        note: "Include country code when available.",
    },
    {
        id: "customer-email",
        name: "Customer Email",
        requirement: "optional",
        note: "Used for customer communication when provided.",
    },
    {
        id: "area",
        name: "Area",
        requirement: "mandatory",
        note: "Delivery area or neighborhood.",
    },
    {
        id: "building",
        name: "Building",
        requirement: "address-part",
        note: "Provide Building, Floor, and Unit when Full Address is not used.",
    },
    {
        id: "floor",
        name: "Floor",
        requirement: "address-part",
        note: "Required with Building and Unit for structured address entry.",
    },
    {
        id: "unit",
        name: "Unit",
        requirement: "address-part",
        note: "Required with Building and Floor for structured address entry.",
    },
    {
        id: "lat",
        name: "Lat",
        requirement: "mandatory",
        note: "Latitude coordinate for accurate delivery routing.",
    },
    {
        id: "long",
        name: "Long",
        requirement: "mandatory",
        note: "Longitude coordinate for accurate delivery routing.",
    },
    {
        id: "full-address",
        name: "Full Address",
        requirement: "mandatory",
        note: "Can be used instead of Building, Floor, and Unit.",
    },
    {
        id: "address-note",
        name: "Address Note",
        requirement: "optional",
        note: "Instructions such as landmark, gate code, or delivery note.",
    },
    {
        id: "address-type-id",
        name: "Address Type ID",
        requirement: "mandatory",
        note: "Tower = 1, Building = 2, Commercial = 3.",
    },
];

const requirementMeta: Record<TemplateField["requirement"], { label: string; color: "error" | "gray" | "brand" }> = {
    mandatory: { label: "Required", color: "error" },
    optional: { label: "Optional", color: "gray" },
    "address-part": { label: "Address part", color: "brand" },
};

export const AddressBookSection = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const pagination = useTablePagination(templateFields);

    const handleFiles = (files: FileList) => {
        setSelectedFile(files[0] ?? null);
    };

    return (
        <div className="flex flex-col gap-6">
            <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                <div className="flex min-w-0 flex-col gap-6 rounded-xl border border-secondary bg-primary p-6 shadow-xs">
                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                        <div className="flex max-w-2xl flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <FeaturedIcon icon={Map01} color="brand" theme="light" size="md" />
                                <div className="flex flex-col">
                                    <h2 className="text-xl font-semibold text-primary">Upload customer address book</h2>
                                    <p className="text-sm text-tertiary">Import reusable customer addresses for faster order creation.</p>
                                </div>
                            </div>
                            <p className="text-sm leading-6 text-tertiary">
                                Upload a CSV or Excel file with customer information. After upload, addresses can be reviewed, edited, or
                                removed before they are saved for future orders.
                            </p>
                        </div>

                        <Illustration type="documents" size="sm" className="hidden shrink-0 text-utility-brand-600 md:block" />
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <InfoTile icon={FileDownload01} title="Use the template" text="Keep column names aligned with the expected format." />
                        <InfoTile icon={CheckCircle} title="Validate fields" text="Required fields and address rules are checked before import." />
                        <InfoTile icon={Shield01} title="Save securely" text="Imported customer address data is hidden after it is saved." />
                    </div>

                    <div className="flex flex-col gap-3 rounded-xl bg-secondary_subtle p-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-col gap-1">
                            <p className="text-sm font-semibold text-primary">Excel template</p>
                            <p className="text-sm text-tertiary">Format: .csv or .xlsx. Use this before uploading customer addresses.</p>
                        </div>
                        <Button color="secondary" size="md" iconLeading={FileDownload01} href="#">
                            Download template
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col gap-4 rounded-xl border border-secondary bg-primary p-5 shadow-xs">
                    <div className="flex items-center gap-3">
                        <FeaturedIcon icon={UploadCloud02} color="gray" theme="light" size="md" />
                        <div className="flex flex-col">
                            <h3 className="text-md font-semibold text-primary">Import file</h3>
                            <p className="text-sm text-tertiary">CSV, XLS, or XLSX up to 10 MB.</p>
                        </div>
                    </div>

                    <FileUpload.Root>
                        <FileUpload.DropZone
                            accept=".csv,.xls,.xlsx"
                            allowsMultiple={false}
                            maxSize={10 * 1024 * 1024}
                            hint="CSV, XLS, or XLSX only (max. 10 MB)"
                            onDropFiles={handleFiles}
                        />
                    </FileUpload.Root>

                    {selectedFile && (
                        <div className="flex items-center justify-between gap-3 rounded-lg border border-secondary bg-secondary_subtle px-3 py-2">
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-primary">{selectedFile.name}</p>
                                <p className="text-xs text-tertiary">{getReadableFileSize(selectedFile.size)}</p>
                            </div>
                            <Badge color="success" type="pill-color" size="sm">
                                Ready
                            </Badge>
                        </div>
                    )}

                    <Button size="md" className="w-full" iconLeading={UploadCloud02} isDisabled={!selectedFile}>
                        Upload address book
                    </Button>
                </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-3">
                <RuleCard
                    tone="error"
                    title="Required fields"
                    description="Customer Name, Customer Phone #, Area, Lat, Long, Full Address, and Address Type ID must be present."
                />
                <RuleCard tone="brand" title="Address rule" description="Use either Full Address or the structured Building, Floor, and Unit fields." />
                <RuleCard tone="gray" title="Address Type ID" description="Tower = 1, Building = 2, Commercial = 3." />
            </section>

            <TableCard.Root>
                <TableCard.Header
                    title="Template columns"
                    badge={`${templateFields.length} fields`}
                    description="Columns expected in the customer address book import file."
                />
                <Table aria-label="Address book template columns">
                    <Table.Header>
                        <Table.Head id="field" isRowHeader label="Field" />
                        <Table.Head id="requirement" label="Requirement" />
                        <Table.Head id="note" label="Usage note" />
                    </Table.Header>
                    <Table.Body items={pagination.paginatedItems}>
                        {(field) => {
                            const requirement = requirementMeta[field.requirement];

                            return (
                                <Table.Row id={field.id}>
                                    <Table.Cell>
                                        <span className="text-sm font-semibold text-primary">{field.name}</span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Badge color={requirement.color} type="pill-color" size="sm">
                                            {requirement.label}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span className="text-sm text-tertiary">{field.note}</span>
                                    </Table.Cell>
                                </Table.Row>
                            );
                        }}
                    </Table.Body>
                </Table>
                <TablePagination totalItems={templateFields.length} page={pagination.page} onPageChange={pagination.setPage} />
            </TableCard.Root>
        </div>
    );
};

const InfoTile = ({
    icon: Icon,
    title,
    text,
}: {
    icon: typeof FileDownload01;
    title: string;
    text: string;
}) => (
    <div className="flex gap-3 rounded-lg border border-secondary bg-primary p-4">
        <FeaturedIcon icon={Icon} color="brand" theme="light" size="sm" />
        <div className="flex min-w-0 flex-col gap-1">
            <p className="text-sm font-semibold text-primary">{title}</p>
            <p className="text-sm text-tertiary">{text}</p>
        </div>
    </div>
);

const RuleCard = ({
    title,
    description,
    tone,
}: {
    title: string;
    description: string;
    tone: "error" | "brand" | "gray";
}) => (
    <div className="flex flex-col gap-2 rounded-xl border border-secondary bg-primary p-4 shadow-xs">
        <Badge color={tone} type="pill-color" size="sm">
            {title}
        </Badge>
        <p className="text-sm leading-6 text-tertiary">{description}</p>
    </div>
);
