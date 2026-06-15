"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

type TablePaginationProps = {
    totalItems: number;
    pageSize?: number;
    page?: number;
    onPageChange?: (page: number) => void;
    className?: string;
};

const getPageNumbers = (currentPage: number, totalPages: number) => {
    if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 3) return [1, 2, 3, "ellipsis", totalPages] as const;
    if (currentPage >= totalPages - 2) return [1, "ellipsis", totalPages - 2, totalPages - 1, totalPages] as const;
    return [1, "ellipsis-start", currentPage, "ellipsis-end", totalPages] as const;
};

export const TablePagination = ({ totalItems, pageSize = 10, page: pageProp, onPageChange, className }: TablePaginationProps) => {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const [uncontrolledPage, setUncontrolledPage] = useState(1);
    const page = pageProp ?? uncontrolledPage;
    const currentPage = Math.min(page, totalPages);
    const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalItems);

    const goToPage = (nextPage: number) => {
        const boundedPage = Math.min(Math.max(nextPage, 1), totalPages);
        onPageChange?.(boundedPage);
        if (pageProp === undefined) setUncontrolledPage(boundedPage);
    };

    return (
        <div className={className}>
            <div className="flex flex-col gap-3 border-t border-secondary px-4 py-3 sm:flex-row sm:items-center sm:justify-between md:px-6">
                <p className="text-sm text-tertiary">
                    Showing <span className="font-medium text-secondary">{start}</span> to{" "}
                    <span className="font-medium text-secondary">{end}</span> of{" "}
                    <span className="font-medium text-secondary">{totalItems}</span> results
                </p>

                <Pagination className="w-auto justify-start sm:justify-end">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                isDisabled={currentPage === 1}
                                onClick={(event) => {
                                    event.preventDefault();
                                    goToPage(currentPage - 1);
                                }}
                            />
                        </PaginationItem>

                        {getPageNumbers(currentPage, totalPages).map((item, index) => (
                            <PaginationItem key={`${item}-${index}`} className="max-sm:hidden">
                                {typeof item === "number" ? (
                                    <PaginationLink
                                        href="#"
                                        isActive={item === currentPage}
                                        onClick={(event) => {
                                            event.preventDefault();
                                            goToPage(item);
                                        }}
                                    >
                                        {item}
                                    </PaginationLink>
                                ) : (
                                    <PaginationEllipsis />
                                )}
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                isDisabled={currentPage === totalPages}
                                onClick={(event) => {
                                    event.preventDefault();
                                    goToPage(currentPage + 1);
                                }}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
};

export const useTablePagination = <T,>(items: T[], pageSize = 10) => {
    const [page, setPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
    const currentPage = Math.min(page, totalPages);

    useEffect(() => {
        setPage(1);
    }, [items.length, pageSize]);

    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return items.slice(start, start + pageSize);
    }, [items, currentPage, pageSize]);

    return {
        page: currentPage,
        pageSize,
        paginatedItems,
        setPage,
    };
};
