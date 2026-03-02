import React from 'react';

export const TableSkeleton = ({ rows = 5 }) => {
    return (
        <div className="animate-pulse bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            {/* Header Skeleton */}
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 border-b border-gray-100 dark:border-gray-700 flex space-x-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/4"></div>
            </div>

            {/* Rows Skeleton */}
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {[...Array(rows)].map((_, i) => (
                    <div key={i} className="p-4 flex items-center justify-between space-x-4">
                        <div className="flex items-center space-x-3 w-1/4">
                            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full shrink-0"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                        </div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/4"></div>
                        <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-1/4"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};
