"use client";

import type { ComponentProps } from "react";
import { Field as BaseField } from "@base-ui/react/field";
import { cx } from "@/utils/cx";

export const Field = ({ className, ...props }: ComponentProps<typeof BaseField.Root>) => (
    <BaseField.Root {...props} className={cx("flex flex-col gap-1.5", className)} />
);

export const FieldLabel = ({ className, ...props }: ComponentProps<typeof BaseField.Label>) => (
    <BaseField.Label {...props} className={cx("text-sm font-medium text-secondary", className)} />
);

export const FieldDescription = ({ className, ...props }: ComponentProps<typeof BaseField.Description>) => (
    <BaseField.Description {...props} className={cx("text-sm text-tertiary", className)} />
);

export const FieldError = ({ className, ...props }: ComponentProps<typeof BaseField.Error>) => (
    <BaseField.Error {...props} className={cx("text-sm text-error-primary", className)} />
);

export const FieldValidity = BaseField.Validity;
