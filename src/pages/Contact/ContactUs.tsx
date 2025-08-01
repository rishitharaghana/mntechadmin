import  { useState, useEffect } from "react";
import { Loader2 } from "lucide-react"; // Import Loader2 for consistency
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
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

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
        setContacts(Array.isArray(response.data) ? response.data : response.data.data || []);
      } catch (err) {
        const axiosError = err as AxiosError<AxiosErrorResponse>;
        const errorMessage =
          axiosError.response?.status === 404
            ? "Contact endpoint not found (404). Please check the API URL."
            : axiosError.code === "ERR_NETWORK"
            ? "CORS error: The server may not be configured to allow cross-origin requests from this origin."
            : axiosError.response?.data?.message || axiosError.message || "Failed to fetch contact data";
        setError(errorMessage);
        console.error("Error fetching contacts:", {
          message: axiosError.message,
          status: axiosError.response?.status,
          data: axiosError.response?.data,
          url: axiosError.config?.url,
          code: axiosError.code,
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
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedData = contacts.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1); // Fixed typo: setBizCurrentPage -> setCurrentPage
  };

  const getPaginationItems = () => {
    if (totalPages === 0) return [];

    const pages: (number | string)[] = [];
    const totalVisiblePages = 5;

    if (totalPages <= totalVisiblePages + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(2, currentPage - 2);
      let end = Math.min(totalPages - 1, currentPage + 2);

      if (currentPage <= 3) {
        start = 2;
        end = 5;
      }

      if (currentPage >= totalPages - 2) {
        start = totalPages - 4;
        end = totalPages - 1;
      }

      pages.push(1);
      if (start > 2) pages.push("...");
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (end < totalPages - 1) pages.push("...");
      if (totalPages > 1) pages.push(totalPages);
    }

    return pages;
  };

  if (loading) {
    return (
      <>
        <PageMeta
          title="MnTechs Contact List Dashboard | MN Techs Solution Pvt Ltd "
          description="This is MNTechs Contact List - Mn Techs Admin Dashboard"
        />
        <div className="flex justify-between items-baseline mb-4">
          <PageBreadcrumb pageTitle="Contact List" />
        </div>
        <div className="space-y-6">
          <ComponentCard title="Contact List">
            <div className="flex justify-center items-center h-64">
              <Loader2 className="size-6 text-gray-500 animate-spin" />
              <span className="ml-2 text-gray-500">Loading...</span>
            </div>
          </ComponentCard>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageMeta
          title="MnTechs Contact List Dashboard | MN Techs Solution Pvt Ltd  "
          description="This is MN techs  Contact List - Mn Techs Admin Dashboard"
        />
        <div className="flex justify-between items-baseline mb-4">
          <PageBreadcrumb pageTitle="Contact List" />
        </div>
        <div className="space-y-6">
          <ComponentCard title="Contact List">
            <div className="text-center text-red-500 dark:text-red-400 text-lg py-10">
              {error}
            </div>
          </ComponentCard>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title="MnTechs Contact List | MN Techs Solution Pvt Ltd  "
        description="This is MnTechs Contact List - Mn Techs Admin Dashboard"
      />
      <div className="flex justify-between items-baseline mb-4">
        <PageBreadcrumb pageTitle="Contact List" />
      </div>
      <div className="space-y-6">
        <ComponentCard title="Contact List">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
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
                  {paginatedData.length > 0 ? (
                    paginatedData.map((contact, index) => (
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
                            {contact.agreeToUpdates ? "Yes" : "No"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell className="px-5 py-4 text-center text-gray-600 text-sm dark:text-gray-400" >
                        No contacts found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          {!loading && !error && totalItems > itemsPerPage && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 px-4 py-2 gap-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {startIndex + 1} to {endIndex} of {totalItems} entries
              </div>
              <div className="flex gap-2 flex-wrap justify-center">
                <Button
                  variant={currentPage === 1 ? "outline" : "primary"}
                  size="sm"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={currentPage === 1 ? "text-gray-500" : "bg-[#1D3A76] text-white"}
                >
                  Previous
                </Button>
                {getPaginationItems().map((page, index) =>
                  page === "..." ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-3 py-1 text-gray-500 dark:text-gray-400"
                    >
                      ...
                    </span>
                  ) : (
                    <Button
                      key={page}
                      variant={page === currentPage ? "primary" : "outline"}
                      size="sm"
                      onClick={() => goToPage(page as number)}
                      className={
                        page === currentPage
                          ? "bg-[#1D3A76] text-white"
                          : "text-gray-500"
                      }
                    >
                      {page}
                    </Button>
                  )
                )}
                <Button
                  variant={currentPage === totalPages ? "outline" : "primary"}
                  size="sm"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={currentPage === totalPages ? "text-gray-500" : "bg-[#1D3A76] text-white"}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </ComponentCard>
      </div>
    </>
  );
}