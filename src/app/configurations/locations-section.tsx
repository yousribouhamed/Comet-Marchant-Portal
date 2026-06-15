"use client";

import { type FormEvent, useMemo, useState } from "react";
import { Building02, Edit04, Mail01, Map01, MarkerPin01, Phone01, Plus, Route, SearchMd, Trash01 } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input as UntitledInput } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import { Toggle } from "@/components/base/toggle/toggle";
import { Table, TableCard } from "@/components/application/table/table";
import { TablePagination, useTablePagination } from "@/components/application/table/table-pagination";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import {
    Dialog,
    DialogClose,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogPanel,
    DialogPopup,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";

type Location = {
    id: string;
    name: string;
    fullAddress: string;
    city: string;
    latitude: string;
    longitude: string;
    status: "active" | "draft";
};

const initialLocations: Location[] = [
    {
        id: "moe",
        name: "MOE",
        fullAddress: "Office 202, 2nd floor, next to KFC, Mall Of The Emirates, Al Barsha 1, Dubai, United Arab Emirates",
        city: "Dubai",
        latitude: "25.1181",
        longitude: "55.2006",
        status: "active",
    },
];

const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const locationTypes = [
    { id: "warehouse", label: "Warehouse" },
    { id: "pickup", label: "Pickup Location" },
    { id: "store", label: "Store Branch" },
    { id: "office", label: "Office" },
];

export const LocationsSection = () => {
    const [locations, setLocations] = useState<Location[]>(initialLocations);
    const [query, setQuery] = useState("");

    const filteredLocations = useMemo(() => {
        const normalized = query.trim().toLowerCase();
        if (!normalized) return locations;

        return locations.filter((location) =>
            [location.name, location.fullAddress, location.city, location.latitude, location.longitude].join(" ").toLowerCase().includes(normalized),
        );
    }, [locations, query]);
    const pagination = useTablePagination(filteredLocations);

    const primaryLocation = locations[0];

    const handleAddLocation = (location: Omit<Location, "id" | "status">) => {
        setLocations((current) => [
            ...current,
            {
                ...location,
                id: `${location.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
                status: "active",
            },
        ]);
    };

    const handleUpdateLocation = (updatedLocation: Location) => {
        setLocations((current) => current.map((location) => (location.id === updatedLocation.id ? updatedLocation : location)));
    };

    const handleRemoveLocation = (id: string) => {
        setLocations((current) => current.filter((location) => location.id !== id));
    };

    return (
        <div className="flex flex-col gap-6">
            <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                <div className="overflow-hidden rounded-xl border border-secondary bg-primary shadow-xs">
                    <div className="flex flex-col gap-3 border-b border-secondary px-5 py-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-3">
                            <FeaturedIcon icon={Map01} color="brand" theme="light" size="md" />
                            <div className="flex flex-col">
                                <h2 className="text-lg font-semibold text-primary">Locations</h2>
                                <p className="text-sm text-tertiary">Manage pickup and warehouse locations used for order dispatch.</p>
                            </div>
                        </div>

                        <AddLocationDialog onAdd={handleAddLocation} />
                    </div>

                    <DubaiMapPreview location={primaryLocation} />
                </div>

                <aside className="flex flex-col gap-4 rounded-xl border border-secondary bg-primary p-5 shadow-xs">
                    <div className="flex items-center gap-3">
                        <FeaturedIcon icon={Building02} color="success" theme="light" size="md" />
                        <div className="flex flex-col">
                            <p className="text-sm font-medium text-tertiary">Primary location</p>
                            <h3 className="text-lg font-semibold text-primary">{primaryLocation?.name ?? "No location"}</h3>
                        </div>
                    </div>

                    {primaryLocation ? (
                        <div className="flex flex-col gap-4">
                            <p className="text-sm leading-6 text-secondary">{primaryLocation.fullAddress}</p>

                            <dl className="grid gap-3 text-sm">
                                <InfoRow label="City" value={primaryLocation.city} />
                                <InfoRow label="Coordinates" value={`${primaryLocation.latitude}, ${primaryLocation.longitude}`} />
                                <InfoRow label="Status" value="Active" />
                            </dl>

                            <div className="rounded-lg bg-secondary_subtle p-3">
                                <div className="flex items-start gap-2">
                                    <Route className="mt-0.5 size-4 shrink-0 text-fg-brand-primary" aria-hidden="true" />
                                    <p className="text-sm text-tertiary">
                                        This location is pinned near Mall Of The Emirates in Al Barsha 1 and will be available when creating pickup orders.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-tertiary">Add a location to make it available for pickup and dispatch workflows.</p>
                    )}
                </aside>
            </section>

            <TableCard.Root>
                <TableCard.Header
                    title="Saved locations"
                    badge={`${locations.length} ${locations.length === 1 ? "location" : "locations"}`}
                    description="Locations available for pickup, dispatch, and order creation."
                    contentTrailing={
                        <UntitledInput
                            aria-label="Search locations"
                            placeholder="Search locations"
                            icon={SearchMd}
                            value={query}
                            onChange={setQuery}
                            className="w-full md:w-72"
                        />
                    }
                />

                {filteredLocations.length === 0 ? (
                    <div className="flex flex-col items-center gap-1 py-12 text-center">
                        <p className="text-sm font-medium text-primary">No locations found</p>
                        <p className="text-sm text-tertiary">Try another search or add a new location.</p>
                    </div>
                ) : (
                    <>
                        <Table aria-label="Saved locations">
                            <Table.Header>
                                <Table.Head id="name" isRowHeader label="Name" />
                                <Table.Head id="address" label="Full address" />
                                <Table.Head id="city" label="City" />
                                <Table.Head id="coordinates" label="Coordinates" />
                                <Table.Head id="status" label="Status" />
                                <Table.Head id="actions" label="Actions" />
                            </Table.Header>
                            <Table.Body items={pagination.paginatedItems}>
                                {(location) => (
                                    <Table.Row id={location.id}>
                                        <Table.Cell>
                                            <div className="flex min-w-36 items-center gap-3">
                                                <FeaturedIcon icon={MarkerPin01} color="brand" theme="light" size="sm" />
                                                <span className="text-sm font-semibold text-primary">{location.name}</span>
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <p className="max-w-xl text-sm leading-5 text-secondary">{location.fullAddress}</p>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <span className="text-sm font-medium text-primary">{location.city}</span>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <span className="whitespace-nowrap font-mono text-sm text-tertiary">
                                                {location.latitude}, {location.longitude}
                                            </span>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Badge color={location.status === "active" ? "success" : "gray"} type="pill-color" size="sm">
                                                {location.status === "active" ? "Active" : "Draft"}
                                            </Badge>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className="flex items-center gap-3">
                                                <Button color="link-destructive" size="sm" iconLeading={Trash01} onClick={() => handleRemoveLocation(location.id)}>
                                                    Remove
                                                </Button>
                                                <EditLocationDialog location={location} onSave={handleUpdateLocation} />
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table>
                        <TablePagination totalItems={filteredLocations.length} page={pagination.page} onPageChange={pagination.setPage} />
                    </>
                )}
            </TableCard.Root>
        </div>
    );
};

const DubaiMapPreview = ({ location }: { location?: Location }) => (
    <div className="relative h-80 overflow-hidden bg-[#eaf1f7] md:h-96">
        <div className="absolute inset-0 bg-[linear-gradient(110deg,#8cc4f3_0%,#8cc4f3_36%,#eef3f7_36%,#eef3f7_100%)]" />
        <div className="absolute -left-24 top-16 h-96 w-96 rounded-full border-[34px] border-white/60 opacity-80" />
        <div className="absolute left-[37%] top-0 h-full w-2 -rotate-[35deg] rounded-full bg-[#e782a7] shadow-[80px_30px_0_#e782a7,180px_95px_0_#f19a8b,280px_20px_0_#d97ca4]" />
        <div className="absolute left-[46%] top-20 h-1.5 w-[42%] rotate-[8deg] rounded-full bg-[#e782a7]" />
        <div className="absolute left-[48%] top-44 h-1.5 w-[35%] -rotate-[18deg] rounded-full bg-[#f19a8b]" />
        <div className="absolute left-[44%] top-64 h-1.5 w-[50%] rotate-[24deg] rounded-full bg-[#e782a7]" />
        <div className="absolute left-[56%] top-6 text-sm font-semibold text-secondary">Dubai</div>
        <div className="absolute left-[51%] top-[44%] text-xs font-medium text-tertiary">Al Barsha 1</div>
        <div className="absolute right-[16%] top-16 text-xs font-semibold text-tertiary">Al Dhaid</div>
        <div className="absolute right-[22%] bottom-10 text-xs font-semibold text-tertiary">Al Madam</div>

        {location && (
            <div className="absolute left-[49%] top-[42%] -translate-x-1/2 -translate-y-full">
                <div className="relative flex flex-col items-center">
                    <div className="rounded-full bg-brand-solid px-3 py-1 text-xs font-semibold text-white shadow-lg">{location.name}</div>
                    <MarkerPin01 className="mt-1 size-12 fill-brand-solid text-brand-solid drop-shadow-lg" aria-hidden="true" />
                </div>
            </div>
        )}
    </div>
);

const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center justify-between gap-4 border-b border-secondary pb-2 last:border-b-0 last:pb-0">
        <dt className="text-tertiary">{label}</dt>
        <dd className="text-right font-medium text-primary">{value}</dd>
    </div>
);

const AddLocationDialog = ({ onAdd }: { onAdd: (location: Omit<Location, "id" | "status">) => void }) => {
    const [open, setOpen] = useState(false);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);

        onAdd({
            name: String(form.get("name") || "New location"),
            fullAddress: String(form.get("fullAddress") || form.get("searchAddress") || ""),
            city: String(form.get("city") || "Dubai"),
            latitude: String(form.get("latitude") || "25.2048"),
            longitude: String(form.get("longitude") || "55.2708"),
        });

        setOpen(false);
        event.currentTarget.reset();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button />}>
                <Plus className="size-4" aria-hidden="true" />
                Add location
            </DialogTrigger>
            <LocationFormDialog
                title="Add Location"
                description="Add a pickup or warehouse location with contact details, map coordinates, and working hours."
                submitLabel="Add Location"
                onSubmit={handleSubmit}
                mode="add"
            />
        </Dialog>
    );
};

const EditLocationDialog = ({ location, onSave }: { location: Location; onSave: (location: Location) => void }) => {
    const [open, setOpen] = useState(false);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);

        onSave({
            ...location,
            name: String(form.get("name") || location.name),
            fullAddress: String(form.get("fullAddress") || location.fullAddress),
            city: String(form.get("city") || location.city),
            latitude: String(form.get("latitude") || location.latitude),
            longitude: String(form.get("longitude") || location.longitude),
        });

        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button color="link-color" size="sm" iconLeading={Edit04} />}>Edit</DialogTrigger>
            <LocationFormDialog
                title="Edit location"
                description="Update the saved location details."
                submitLabel="Save changes"
                location={location}
                onSubmit={handleSubmit}
                mode="edit"
            />
        </Dialog>
    );
};

const LocationFormDialog = ({
    title,
    description,
    submitLabel,
    location,
    onSubmit,
    mode,
}: {
    title: string;
    description: string;
    submitLabel: string;
    location?: Partial<Location>;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    mode: "add" | "edit";
}) => {
    const defaultLat = location?.latitude ?? "25.2048";
    const defaultLong = location?.longitude ?? "55.2708";
    const defaultAddress = location?.fullAddress ?? "";

    return (
        <DialogPopup className="sm:max-w-7xl">
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <Form className="contents" onSubmit={onSubmit}>
                <DialogPanel className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-8">
                    <section className="flex min-w-0 flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-md font-semibold text-primary">Location details</h3>
                            <p className="text-sm text-tertiary">Name, type, contact person, and return behavior.</p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <UntitledInput name="name" label="Location name" placeholder="Enter Location Name" defaultValue={location?.name} isRequired type="text" />

                            <Select
                                name="locationType"
                                label="Location type"
                                placeholder="Location Type"
                                items={locationTypes}
                                defaultSelectedKey={mode === "edit" ? "warehouse" : undefined}
                            >
                                {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                            </Select>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <UntitledInput name="email" label="Email address" placeholder="Enter Email Address" type="email" icon={Mail01} />

                            <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-2">
                                <UntitledInput name="countryCode" label="Code" defaultValue="+971" type="text" />
                                <UntitledInput name="phone" label="Phone number" placeholder="Phone number" type="tel" icon={Phone01} />
                            </div>
                        </div>

                        <Checkbox name="disableReturns" size="md" label="Don't return orders to this location" />

                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-semibold text-primary">Select working hours</p>
                                <p className="text-sm text-tertiary">Enable the days this location can receive pickups and returned orders.</p>
                            </div>
                            <ul className="grid gap-x-6 rounded-lg border border-secondary bg-primary px-4 sm:grid-cols-2">
                                {weekDays.map((day) => (
                                    <li key={day} className="flex items-center justify-between gap-4 border-b border-secondary py-4 last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0">
                                        <span className="text-sm font-medium text-secondary">{day}</span>
                                        <Toggle aria-label={`${day} working hours`} size="md" />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    <section className="flex min-w-0 flex-col gap-5 border-t border-secondary pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-md font-semibold text-primary">Address and map</h3>
                            <p className="text-sm text-tertiary">Search the location, confirm coordinates, and save the full address.</p>
                        </div>

                        <UntitledInput
                            name="searchAddress"
                            label="Search address"
                            placeholder="Search Address"
                            defaultValue={mode === "edit" ? defaultAddress : undefined}
                            type="text"
                            icon={SearchMd}
                        />

                        <div className="grid gap-4 sm:grid-cols-2">
                            <UntitledInput name="latitude" label="Latitude" defaultValue={defaultLat} isRequired type="text" inputMode="decimal" />
                            <UntitledInput name="longitude" label="Longitude" defaultValue={defaultLong} isRequired type="text" inputMode="decimal" />
                        </div>

                        <StreetMapPreview />

                        <UntitledInput name="fullAddress" label="Full address" placeholder="Full Address" defaultValue={defaultAddress} isRequired type="text" />

                        <input type="hidden" name="city" value={location?.city ?? "Dubai"} />
                    </section>
                </DialogPanel>
                <DialogFooter>
                    <DialogClose render={<Button color="secondary" type="button" />}>Cancel</DialogClose>
                    <Button type="submit">{submitLabel}</Button>
                </DialogFooter>
            </Form>
        </DialogPopup>
    );
};

const StreetMapPreview = () => (
    <div className="relative h-56 overflow-hidden rounded-xl border border-secondary bg-[#e6eef2]">
        <div className="absolute inset-0 bg-[#dfe9ee]" />
        <div className="absolute -left-10 top-10 h-32 w-64 rotate-[-28deg] rounded-[40px] bg-[#f8f3cd] ring-8 ring-white/80" />
        <div className="absolute left-10 top-8 h-10 w-[120%] rotate-[30deg] bg-[#f5f0c8] ring-4 ring-white/70" />
        <div className="absolute left-20 top-28 h-12 w-[110%] rotate-[-48deg] bg-[#e778a9]" />
        <div className="absolute left-42 top-8 h-12 w-[110%] rotate-[-50deg] bg-[#e778a9]" />
        <div className="absolute right-0 top-12 h-12 w-[90%] rotate-[64deg] bg-[#ff9a8e]" />
        <div className="absolute left-54 top-24 rotate-[31deg] text-xl font-semibold text-primary">Financial Center Street</div>
        <div className="absolute left-38 top-20 rotate-[-51deg] text-lg font-semibold text-primary">Sheikh Zayed Road</div>
        <div className="absolute left-4 top-28 text-xs font-medium text-tertiary">Naif Car Park</div>
        <div className="absolute left-[48%] top-[48%] -translate-x-1/2 -translate-y-full">
            <MarkerPin01 className="size-14 fill-brand-solid text-brand-solid drop-shadow-lg" aria-hidden="true" />
        </div>
    </div>
);
