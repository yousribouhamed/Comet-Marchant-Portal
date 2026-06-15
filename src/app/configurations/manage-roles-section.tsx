"use client";

import { useState } from "react";
import { Edit01, Mail01, Plus, Trash01 } from "@untitledui/icons";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge, BadgeWithDot } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { Toggle } from "@/components/base/toggle/toggle";
import { Table, TableCard } from "@/components/application/table/table";
import { TablePagination, useTablePagination } from "@/components/application/table/table-pagination";
import { Button as CossButton } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogFooter,
    DialogHeader,
    DialogPanel,
    DialogPopup,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input as CossInput } from "@/components/ui/input";
import { cx } from "@/utils/cx";

type User = {
    id: string;
    fullName: string;
    email: string;
    role: string;
    avatarUrl?: string;
    invitationPending?: boolean;
};

const owner = {
    fullName: "Olivia Rhye",
    designation: "Owner",
    email: "olivia@untitledui.com",
    avatarUrl: "https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80",
};

const initialUsers: User[] = [
    {
        id: "2",
        fullName: "Phoenix Baker",
        email: "phoenix@untitledui.com",
        role: "Manager",
        avatarUrl: "https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80",
    },
    {
        id: "3",
        fullName: "Lana Steiner",
        email: "lana@untitledui.com",
        role: "Operations",
        avatarUrl: "https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80",
        invitationPending: true,
    },
    {
        id: "4",
        fullName: "Demi Wilkinson",
        email: "demi@untitledui.com",
        role: "Support",
        avatarUrl: "https://www.untitledui.com/images/avatars/demi-wilkinson?fm=webp&q=80",
    },
    {
        id: "5",
        fullName: "Candice Wu",
        email: "candice@untitledui.com",
        role: "Viewer",
        avatarUrl: "https://www.untitledui.com/images/avatars/candice-wu?fm=webp&q=80",
        invitationPending: true,
    },
];

const countryCodes = [
    { id: "+971", label: "+971" },
    { id: "+966", label: "+966" },
    { id: "+1", label: "+1" },
    { id: "+44", label: "+44" },
    { id: "+91", label: "+91" },
    { id: "+33", label: "+33" },
];

const permissions = [
    {
        id: "administrator",
        title: "Administrator",
        description: "Full access and control over the company",
    },
    {
        id: "financial-manager",
        title: "Financial Manager",
        description: "Users with this role will be able to view transactions and request payouts",
    },
    {
        id: "cod-manager",
        title: "COD Manager",
        description: "Access to view COD Transactions",
    },
] as const;

type PermissionId = (typeof permissions)[number]["id"];

const PERMISSION_TO_ROLE: Record<PermissionId, string> = {
    administrator: "Administrator",
    "financial-manager": "Financial Manager",
    "cod-manager": "COD Manager",
};

const RowActionsDropdown = () => (
    <Dropdown.Root>
        <Dropdown.DotsButton />
        <Dropdown.Popover className="w-min">
            <Dropdown.Menu>
                <Dropdown.Item icon={Edit01}>
                    <span className="pr-4">Edit</span>
                </Dropdown.Item>
                <Dropdown.Item icon={Trash01}>
                    <span className="pr-4">Remove</span>
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown.Popover>
    </Dropdown.Root>
);

const AddNewUserDialog = ({
    onInvite,
}: {
    onInvite: (fullName: string, email: string, roles: string[]) => void;
}) => {
    const [open, setOpen] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [countryCode, setCountryCode] = useState<string>("+971");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [enabledPermissions, setEnabledPermissions] = useState<Record<PermissionId, boolean>>({
        administrator: false,
        "financial-manager": false,
        "cod-manager": false,
    });

    const togglePermission = (id: PermissionId, value: boolean) =>
        setEnabledPermissions((prev) => ({ ...prev, [id]: value }));

    const reset = () => {
        setFirstName("");
        setLastName("");
        setCountryCode("+971");
        setPhone("");
        setEmail("");
        setEnabledPermissions({ administrator: false, "financial-manager": false, "cod-manager": false });
    };

    const isValid = Boolean(firstName.trim() && lastName.trim() && email.trim());

    const handleInvite = () => {
        if (!isValid) return;
        const roles = permissions.filter((p) => enabledPermissions[p.id]).map((p) => PERMISSION_TO_ROLE[p.id]);
        onInvite(`${firstName.trim()} ${lastName.trim()}`, email.trim(), roles.length ? roles : ["Member"]);
        reset();
        setOpen(false);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(v) => {
                if (!v) reset();
                setOpen(v);
            }}
        >
            <DialogTrigger render={<CossButton variant="outline" type="button" />}>
                <Plus aria-hidden="true" className="size-4" />
                Add New User
            </DialogTrigger>
            <DialogPopup className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Add new user</DialogTitle>
                </DialogHeader>

                <Form className="contents" onSubmit={(event) => event.preventDefault()}>
                    <DialogPanel className="flex flex-col gap-5">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field name="firstName">
                                <FieldLabel>First Name *</FieldLabel>
                                <CossInput
                                    type="text"
                                    placeholder="First Name"
                                    value={firstName}
                                    onValueChange={setFirstName}
                                    required
                                />
                            </Field>
                            <Field name="lastName">
                                <FieldLabel>Last Name</FieldLabel>
                                <CossInput
                                    type="text"
                                    placeholder="Last Name"
                                    value={lastName}
                                    onValueChange={setLastName}
                                />
                            </Field>
                        </div>

                        <div className="grid grid-cols-[7.5rem_1fr] gap-4">
                            <Field name="countryCode">
                                <FieldLabel>Country Code</FieldLabel>
                                <select
                                    value={countryCode}
                                    onChange={(event) => setCountryCode(event.target.value)}
                                    className="h-10 w-full rounded-lg border border-primary bg-primary px-3 text-sm font-medium text-primary shadow-xs outline-focus-ring transition duration-100 ease-linear focus-visible:border-brand focus-visible:outline-2 focus-visible:outline-offset-0"
                                >
                                    {countryCodes.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.label}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                            <Field name="phone">
                                <FieldLabel>Phone Number</FieldLabel>
                                <CossInput
                                    type="tel"
                                    placeholder="Phone Number"
                                    value={phone}
                                    onValueChange={setPhone}
                                />
                            </Field>
                        </div>

                        <Field name="email">
                            <FieldLabel>Email *</FieldLabel>
                            <CossInput
                                type="email"
                                placeholder="Email"
                                value={email}
                                onValueChange={setEmail}
                                required
                            />
                            <FieldDescription>Invite link will be sent to the user on this email</FieldDescription>
                        </Field>

                        <div className="flex flex-col gap-1.5 pt-2">
                            <h3 className="text-xl font-semibold text-primary">Manage Permissions</h3>
                            <p className="text-sm text-tertiary">
                                Give the access of app to your team, so they can help you manage your business
                            </p>
                            <p className="mt-3 text-sm font-medium text-secondary">You can enable multiple roles</p>
                        </div>

                        <ul className="flex flex-col">
                            {permissions.map((perm, idx) => (
                                <li
                                    key={perm.id}
                                    className={cx(
                                        "flex items-start justify-between gap-4 py-4",
                                        idx !== permissions.length - 1 && "border-b border-secondary",
                                    )}
                                >
                                    <div className="flex flex-col gap-1">
                                        <h4 className="text-md font-semibold text-primary">{perm.title}</h4>
                                        <p className="text-sm text-brand-secondary">{perm.description}</p>
                                    </div>
                                    <Toggle
                                        aria-label={perm.title}
                                        isSelected={enabledPermissions[perm.id]}
                                        onChange={(v) => togglePermission(perm.id, v)}
                                        size="md"
                                    />
                                </li>
                            ))}
                        </ul>
                    </DialogPanel>

                    <DialogFooter className="items-center justify-between sm:justify-between" variant="bare">
                        <DialogClose render={<CossButton variant="ghost" type="button" className="text-error-primary hover:text-error-primary_hover" />}>
                            Discard
                        </DialogClose>
                        <DialogClose
                            render={
                                <CossButton
                                    type="button"
                                    onClick={handleInvite}
                                    disabled={!isValid}
                                />
                            }
                        >
                            Send Invite
                        </DialogClose>
                    </DialogFooter>
                </Form>
            </DialogPopup>
        </Dialog>
    );
};

export const ManageRolesSection = () => {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const pagination = useTablePagination(users);

    const handleInvite = (fullName: string, email: string, roles: string[]) => {
        setUsers((prev) => [
            ...prev,
            {
                id: String(Date.now()),
                fullName,
                email,
                role: roles.join(", "),
                invitationPending: true,
            },
        ]);
    };

    return (
        <div className="flex flex-col gap-6">
            <section className="flex flex-col gap-4 rounded-2xl border border-secondary bg-primary p-5 shadow-xs md:flex-row md:items-center md:justify-between md:gap-6 md:p-6">
                <div className="flex items-center gap-4">
                    <Avatar
                        src={owner.avatarUrl}
                        alt={owner.fullName}
                        initials={owner.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        size="lg"
                    />
                    <div className="flex min-w-0 flex-col gap-1">
                        <span className="text-md font-semibold text-primary">{owner.fullName}</span>
                        <span className="text-sm font-medium text-brand-secondary">{owner.designation}</span>
                        <span className="truncate text-sm text-tertiary">{owner.email}</span>
                    </div>
                </div>
                <Button size="md" color="secondary" iconLeading={Mail01} href={`mailto:${owner.email}`}>
                    Contact owner
                </Button>
            </section>

            <TableCard.Root>
                <TableCard.Header
                    title="Team members"
                    description="Manage your team members and their access levels."
                    contentTrailing={<AddNewUserDialog onInvite={handleInvite} />}
                />

                <Table aria-label="Team members">
                    <Table.Header>
                        <Table.Head id="name" isRowHeader label="Full Name" />
                        <Table.Head id="role" label="Role" />
                        <Table.Head id="actions" label="" className="w-16" />
                    </Table.Header>

                    <Table.Body items={pagination.paginatedItems}>
                        {(user) => (
                            <Table.Row id={user.id}>
                                <Table.Cell>
                                    <div className="flex items-center gap-3">
                                        <Avatar
                                            src={user.avatarUrl}
                                            alt={user.fullName}
                                            initials={user.fullName
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                            size="md"
                                        />
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-primary">{user.fullName}</span>
                                                {user.invitationPending && (
                                                    <BadgeWithDot color="warning" type="pill-color" size="sm">
                                                        Invitation not accepted yet
                                                    </BadgeWithDot>
                                                )}
                                            </div>
                                            <span className="text-sm text-tertiary">{user.email}</span>
                                        </div>
                                    </div>
                                </Table.Cell>
                                <Table.Cell>
                                    <Badge color="gray" type="modern" size="sm">
                                        {user.role}
                                    </Badge>
                                </Table.Cell>
                                <Table.Cell className="px-4">
                                    <div className="flex justify-end">
                                        <RowActionsDropdown />
                                    </div>
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
                <TablePagination totalItems={users.length} page={pagination.page} onPageChange={pagination.setPage} />
            </TableCard.Root>

        </div>
    );
};
