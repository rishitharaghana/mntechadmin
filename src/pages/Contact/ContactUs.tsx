import React, { useState, useEffect } from "react";
import ngrokAxiosInstance from "../../hooks/axiosInstance";
import { AxiosError } from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
interface Contact {
  _id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  agreeToUpdates: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface AxiosErrorResponse {
  message?: string;
}

export default function ContactList() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await ngrokAxiosInstance.get("/contact/contact_us");
        console.log("API Response:", response.data);
        setContacts(
          Array.isArray(response.data)
            ? response.data
            : response.data.data || []
        );
      } catch (err) {
        const axiosError = err as AxiosError<AxiosErrorResponse>;
        const errorMessage =
          axiosError.response?.status === 404
            ? "Contact endpoint not found (404). Please check the API URL."
            : axiosError.response?.data?.message ||
              axiosError.message ||
              "Failed to fetch contact data";
        setError(errorMessage);
        console.error("Error fetching contacts:", {
          message: axiosError.message,
          status: axiosError.response?.status,
          data: axiosError.response?.data,
          url: axiosError.config?.url,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  const totalItems = contacts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedContacts = contacts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-10">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <span className="ml-4 text-gray-600 dark:text-gray-300 text-lg">
        Loading contacts...
      </span>
    </div>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 dark:text-red-400 text-lg py-10">
        {error}
      </div>
    );
  }

  return (
    <ComponentCard title="Contact List">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-200 dark:border-gray-700">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-700 text-start text-sm dark:text-gray-300"
              >
                Sl.No
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-700 text-start text-sm dark:text-gray-300"
              >
                Name
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-700 text-start text-sm dark:text-gray-300"
              >
                Email
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-700 text-start text-sm dark:text-gray-300"
              >
                Phone
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-700 text-start text-sm dark:text-gray-300"
              >
                Message
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-700 text-start text-sm dark:text-gray-300"
              >
                Agree to Updates
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedContacts.length > 0 ? (
              paginatedContacts.map((contact, index) => (
                <TableRow key={contact._id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-600 text-sm dark:text-gray-400">
                    {startIndex + index + 1}
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-600 text-sm dark:text-gray-400">
                    {contact.name}
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-600 text-sm dark:text-gray-400">
                    {contact.email}
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-600 text-sm dark:text-gray-400">
                    {contact.phone || "N/A"}
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-600 text-sm dark:text-gray-400">
                    {contact.message || "N/A"}
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-600 text-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={contact.agreeToUpdates ? "primary" : "warning"}
                    >
                      {" "}
                      {contact.agreeToUpdates ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="px-5 py-4 text-center text-gray-600 text-sm dark:text-gray-400">
                  No contacts found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 px-4 py-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-gray-700 dark:text-gray-200 disabled:opacity-50 rounded-md border border-gray-300 dark:border-gray-600"
          >
            Previous
          </Button>
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "primary" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 text-sm rounded-md ${
                  currentPage === page
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600"
                }`}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-gray-700 dark:text-gray-200 disabled:opacity-50 rounded-md border border-gray-300 dark:border-gray-600"
          >
            Next
          </Button>
        </div>
      )}
    </ComponentCard>
  );
}
