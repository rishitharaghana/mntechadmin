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

// Define the Service interface for individual service entries
interface IndividualService {
  _id: string;
  title: string;
  description: string;
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
  const [loading, setLoading] = useState<boolean>(true); // State for fetching loader
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch services from the API and flatten the services array
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await ngrokAxiosInstance.get('/dynamic/service');
        // Flatten the nested services arrays into a single array
        const allServices = response.data.flatMap((service: Service) => service.services);
        const parentIdTemp = response.data[0]?._id || '68563d750ea11f5d6792298a'; // Use first parent's ID or fallback
        setIndividualServices(allServices);
        setParentId(parentIdTemp);
      } catch (error) {
        console.error('Error fetching services:', error);
        setIndividualServices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [location]); // Refetch when location changes (e.g., after add/edit)

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
    navigate('/services/create', { state: { parentId } });
    setActiveMenu(null);
  };

  // Handle Edit action
  const handleEditClick = (service: IndividualService) => {
    console.log('Edit service:', service);
    navigate(`/services/edit/${service._id}`, { state: { parentId } });
    setActiveMenu(null);
  };

  // Handle Delete action
  const handleDeleteClick = async (service: IndividualService) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await ngrokAxiosInstance.delete(`/dynamic/service/service/${service._id}`);
        setIndividualServices(individualServices.filter((s) => s._id !== service._id));
        console.log('Service deleted:', service._id);
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
    setActiveMenu(null);
  };

  // Show loader while fetching data
  if (loading) {
    return (
      <>
        <PageMeta
          title="React.js Services Dashboard | TailAdmin - Next.js Admin Dashboard Template"
          description="This is React.js Services Dashboard page for TailAdmin - MN techs Admin Dashboard"
        />
        <PageBreadcrumb pageTitle="Services" />
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
        title="React.js Services Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Services Dashboard page for TailAdmin - MN techs Admin Dashboard"
      />
      <PageBreadcrumb pageTitle="Services" />
      <div className="space-y-6">
        {/* Add Service Button Below Breadcrumb */}
        <div className="flex justify-end">
          <Button
            variant="primary"
            onClick={handleCreateClick}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
            aria-label="Add new service"
          >
            Add Service
          </Button>
        </div>
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
                  {individualServices.length > 0 ? (
                    individualServices.map((service, index) => (
                      <TableRow key={service._id}>
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                          {index + 1}
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
                          >
                            <MoreVertical className="size-5 text-gray-500 dark:text-gray-400" />
                          </Button>
                          {activeMenu === service._id && (
                            <div
                              ref={dropdownRef}
                              className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10"
                            >
                              <div className="py-2">
                                <button
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onClick={() => handleEditClick(service)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
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
                      <TableCell  className="px-5 py-4 text-center text-gray-500 text-theme-sm dark:text-gray-400">
                        No services available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}