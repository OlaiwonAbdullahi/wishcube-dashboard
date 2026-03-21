/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

interface EmptyStateProps {
  icon: any;
  title: string;
  description: string;
}

const EmptyState = ({ icon: Icon, title, description }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-full bg-gray-50">
      <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded-full mb-4">
        <Icon className="w-8 h-8 text-gray-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      <p className="text-gray-500 mt-1">{description}</p>
    </div>
  );
};

export default EmptyState;
