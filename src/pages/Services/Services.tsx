import { useEffect, useRef, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import Button from '../../components/ui/button/Button';
import { MoreVertical, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import ngrokAxiosInstance from '../../hooks/axiosInstance';
import ComponentCard from '../../components/common/ComponentCard';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import { AxiosError } from 'axios';

// Define the Service interface for individual service entries
interface IndividualService {
  _id: string;
  title: string;
  description: string;
  icon?: string;
}

// Define the parent Service interface
interface Service {
  _id: string;
  sectionTitle: string;
  heading: string;
  subtitle: string;
  services: IndividualService[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function ServicesTable() {
  const [individualServices, setIndividualServices] = useState<IndividualService[]>([]);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [parentId, setParentId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [error, setError] = useState<string | null>(null); // Added for error handling
  const itemsPerPage = 10;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch services from the API and flatten the services array
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await ngrokAxiosInstance.get('/service/');
        const allServices = response.data.flatMap((service: Service) => service.services);
        const parentIdTemp = response.data[0]?._id || '685a7586a5646909c426b63c';
        setIndividualServices(allServices);
        setParentId(parentIdTemp);
      } catch (error) {
        const err = error as AxiosError<{error : string}>
        console.error('Error fetching services:', err);
        setError(err.response?.data?.error || 'Failed to fetch services');
        setIndividualServices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [location.state?.refetch]); // Added refetch dependency to match ServiceSectionTable

  // Toggle dropdown menu
  const toggleMenu = (id: string) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Create action
  const handleCreateClick = () => {
    if (!parentId) {
      setError('Parent ID is not available');
      return;
    }
    navigate('/services/create', { state: { parentId } });
    setActiveMenu(null);
  };

  // Handle Edit action
  const handleEditClick = (service: IndividualService) => {
    if (!parentId) {
      setError('Parent ID is not available');
      return;
    }
    navigate(`/services/edit/${service._id}`, { state: { parentId } });
    setActiveMenu(null);
  };

  // Handle Delete action
  const handleDeleteClick = async (service: IndividualService) => {
    if (!parentId) {
      setError('Parent ID is not available');
      return;
    }
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await ngrokAxiosInstance.delete(`/service/${parentId}/service-item/${service._id}`);
        setIndividualServices(individualServices.filter((s) => s._id !== service._id));
        console.log('Service item deleted:', service._id);
      } catch (error) {
        const err = error as AxiosError<{error: string}>
        console.error('Error deleting service item:', err);
        setError(err.response?.data?.error || 'Failed to delete service');
      }
      setActiveMenu(null);
    }
  };

  // Pagination logic
  const totalItems = individualServices.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedData = individualServices.slice(startIndex, endIndex);

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
          title="MnTechs Services Dashboard | MN Techs Solution Pvt Ltd "
          description="This is MnTechs Services Dashboard - Mn Techs Admin Dashboard"
        />
        <div className="flex justify-between items-baseline mb-4">
          <PageBreadcrumb pageTitle="Services" />
        </div>
        <div className="space-y-6">
          <ComponentCard title="Services Table">
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
        title="MnTechs Services Dashboard | MN Techs Solution Pvt Ltd  "
        description="This is MnTechs Services Dashboard - Mn Techs Admin Dashboard"
      />
      <div className="flex justify-between items-center mb-4">
        <PageBreadcrumb pageTitle="Services" />
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleCreateClick}
            className="px-4 py-2 text-black! border-gray-200 bg-white hover:bg-gray-50! border dark:border-gray-800"
            aria-label="Add new service"
            disabled={!parentId} // Disable if parentId is not available
          >
            Add Service
          </Button>
        </div>
      </div>
      <div className="space-y-6">
        {error && <div className="text-red-600 dark:text-red-400 mb-4">{error}</div>}
        <ComponentCard title="Services Table">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <Table>
                {/* Table Header */}
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Sl.No
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Title
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Description
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {paginatedData.length > 0 ? (
                    paginatedData.map((service, index) => (
                      <TableRow key={service._id}>
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                          {startIndex + index + 1}
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                          {service.title}
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                          {service.description}
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 relative">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleMenu(service._id)}
                            disabled={loading} // Disable actions during loading
                          >
                            <MoreVertical className="size-5 text-gray-500 dark:text-gray-400" />
                          </Button>
                          {activeMenu === service._id && (
                            <div
                              ref={dropdownRef}
                              className="absolute top-0 right-2 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10"
                            >
                              <div className="">
                                <button
                                  className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onClick={() => handleEditClick(service)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onClick={() => handleDeleteClick(service)}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        // colSpan={4}
                        className="px-5 py-4 text-center text-gray-500 text-theme-sm dark:text-gray-400"
                      >
                        No services available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination Controls */}
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
                          ? 'px-4 py-2 text-black! border-gray-200 bg-white hover:bg-gray-50! border dark:border-gray-800'
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