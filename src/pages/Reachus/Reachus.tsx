import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import ngrokAxiosInstance from '../../hooks/axiosInstance';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../components/ui/table';
import Badge from '../../components/ui/badge/Badge';
import Button from '../../components/ui/button/Button';
import ComponentCard from '../../components/common/ComponentCard';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import { AxiosError } from 'axios'; // Added for error handling

// Define the ReachUs interface based on the API data structure
interface ReachUs {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  phone: string;
  role: string;
  product_design: string;
  product_description: string;
  project_budget: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function ReachUsTable() {
  const [reachUsData, setReachUsData] = useState<ReachUs[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [error, setError] = useState<string | null>(null); // Added for error handling
  const itemsPerPage = 10;

  // Fetch data from the API
  useEffect(() => {
    const fetchReachUs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await ngrokAxiosInstance.get('/reach/getAllReachUs');
        setReachUsData(response.data);
      } catch (error) {
        const err = error as AxiosError<{ error: string }>;
        console.error('Error fetching ReachUs data:', err);
        setError(err.response?.data?.error || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchReachUs();
  }, []);

  // Pagination logic
  const totalItems = reachUsData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedData = reachUsData.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const getPaginationItems = () => {
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
      if (start > 2) pages.push('...');

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) pages.push('...');
      if (totalPages > 1) pages.push(totalPages);
    }

    return pages;
  };

  // Show loader while fetching data
  if (loading) {
    return (
      <>
        <PageMeta
          title="MnTechs Reach Us Table Dashboard | MN Techs Solution Pvt Ltd"
          description="This is MnTechs Reach Us Table Dashboard - Mn Techs Admin Dashboard"
        />
        <PageBreadcrumb pageTitle="Reach Us Table" />
        <div className="space-y-6">
          <ComponentCard title="Reach Us Table">
            <div className="flex justify-center items-center h-64">
              <Loader2 className="size-6 text-gray-500 animate-spin" />
              <span className="ml-2 text-gray-500">Loading...</span>
            </div>
          </ComponentCard>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title="MnTechs Reach Us Table Dashboard | MN Techs Solution Pvt Ltd"
        description="This is MnTechs Reach Us Table Dashboard - Mn Techs Admin Dashboard"
      />
      <PageBreadcrumb pageTitle="Reach Us Table" />
      <div className="space-y-6">
        {error && <div className="text-red-600 dark:text-red-400 mb-4">{error}</div>}
        <ComponentCard title="Reach Us Table">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <Table className="table-auto w-full">
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 align-middle whitespace-nowrap"
                    >
                      Sl.No
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 align-middle whitespace-nowrap"
                    >
                      First Name
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 align-middle whitespace-nowrap"
                    >
                      Last Name
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 align-middle whitespace-nowrap"
                    >
                      Email
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 align-middle whitespace-nowrap"
                    >
                      Company
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 align-middle whitespace-nowrap"
                    >
                      Phone
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 align-middle whitespace-nowrap"
                    >
                      Role
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 align-middle whitespace-nowrap"
                    >
                      Product Design
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 align-middle whitespace-nowrap"
                    >
                      Product Description
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 align-middle whitespace-nowrap"
                    >
                      Project Budget
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 align-middle whitespace-nowrap"
                    >
                      Created At
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {paginatedData.length > 0 ? (
                    paginatedData.map((reachUs, index) => (
                      <TableRow key={reachUs._id}>
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 align-middle whitespace-nowrap">
                          {startIndex + index + 1}
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 align-middle whitespace-nowrap truncate max-w-[150px]">
                          {reachUs.first_name}
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 align-middle whitespace-nowrap truncate max-w-[150px]">
                          {reachUs.last_name}
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 align-middle whitespace-nowrap truncate max-w-[200px]">
                          {reachUs.email}
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 align-middle whitespace-nowrap truncate max-w-[150px]">
                          {reachUs.company}
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 align-middle whitespace-nowrap truncate max-w-[150px]">
                          {reachUs.phone}
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 align-middle whitespace-nowrap">
                          <Badge size="sm" color="success">
                            {reachUs.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 align-middle whitespace-nowrap truncate max-w-[200px]">
                          {reachUs.product_design}
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 align-middle whitespace-nowrap truncate max-w-[250px]">
                          {reachUs.product_description}
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 align-middle whitespace-nowrap truncate max-w-[150px]">
                          {reachUs.project_budget}
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 align-middle whitespace-nowrap">
                          {new Date(reachUs.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={11}
                        className="px-5 py-4 text-center text-gray-500 text-theme-sm29-sm dark:text-gray-400"
                      >
                        No data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {totalItems > itemsPerPage && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 px-4 py-2 gap-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {startIndex + 1} to {endIndex} of {totalItems} entries
              </div>
              <div className="flex gap-2 flex-wrap justify-center">
                <Button
                  variant={currentPage === 1 ? 'outline' : 'primary'}
                  size="sm"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-black! border-gray-200 bg-white hover:bg-gray-50! border dark:border-gray-800"
                >
                  Previous
                </Button>
                {getPaginationItems().map((page, index) =>
                  page === '...' ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-3 py-1 text-gray-500 dark:text-gray-400"
                    >
                      ...
                    </span>
                  ) : (
                    <Button
                      key={page}
                      variant={page === currentPage ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => goToPage(page as number)}
                      className={
                        page === currentPage
                          ? 'px-4 py-2 bg-[#1D3A76] text-white border-gray-200 hover:bg-gray-50! border dark:border-gray-800'
                          : 'px-4 py-2 text-black! border-gray-200 bg-white hover:bg-gray-50! border dark:border-gray-800'
                      }
                    >
                      {page}
                    </Button>
                  )
                )}
                <Button
                  variant={currentPage === totalPages ? 'outline' : 'primary'}
                  size="sm"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-black! border-gray-200 bg-white hover:bg-gray-50! border dark:border-gray-800"
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