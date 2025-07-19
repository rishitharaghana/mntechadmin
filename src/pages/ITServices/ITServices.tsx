import { useEffect, useRef, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import Badge from '../../components/ui/badge/Badge';
import ngrokAxiosInstance from '../../hooks/axiosInstance';
import Button from '../../components/ui/button/Button';
import { MoreVertical, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import ComponentCard from '../../components/common/ComponentCard';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';

interface Item {
  _id: string;
  title: string;
  description: string;
  icon: string;
}

interface ServiceSection {
  _id: string;
  sectionTitle: string;
  itServicesTitle: string;
  productsTitle: string;
  itServices: Item[];
  products: Item[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface TableItem extends Item {
  type: 'Service' | 'Product';
}

export default function ServiceSectionTable() {
  const [items, setItems] = useState<TableItem[]>([]);
  const [sectionId, setSectionId] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); // Added for error handling
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch service section data
  useEffect(() => {
    const fetchServiceSection = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await ngrokAxiosInstance.get('/dynamic/serviceSection');
        const data: ServiceSection = response.data;
        setSectionId(data._id);
        const combinedItems: TableItem[] = [
          ...data.itServices.map((item) => ({ ...item, type: 'Service' as const })),
          ...data.products.map((item) => ({ ...item, type: 'Product' as const })),
        ];
        setItems(combinedItems);
      } catch (error: any) {
        console.error('Error fetching service section:', error);
        setError(error.response?.data?.error || 'Failed to fetch service section');
      } finally {
        setLoading(false);
      }
    };
    fetchServiceSection();
  }, [location.state?.refetch]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Toggle dropdown menu
  const toggleMenu = (id: string) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  // Handle Edit action
  const handleEditClick = (item: TableItem) => {
    console.log('Edit item:', item);
    navigate(`/it-services/edit/${item.type.toLowerCase()}/${item._id}`, {
      state: { parentId: sectionId },
    });
    setActiveMenu(null);
  };

  // Handle Create action
  const handleCreateClick = (type: 'Service' | 'Product') => {
    if (!sectionId) {
      setError('Section ID is not available');
      return;
    }
    navigate(`/it-services/create/${type.toLowerCase()}`, {
      state: { parentId: sectionId },
    });
  };

  // Handle Delete action
  const handleDeleteClick = async (item: TableItem) => {
    if (!sectionId) {
      setError('Section ID is not available');
      return;
    }
    if (window.confirm(`Are you sure you want to delete this ${item.type.toLowerCase()}?`)) {
      try {
        // Fix: Use 'itServices' instead of 'services' for Service type
        const type = item.type === 'Service' ? 'itServices' : 'products';
        const endpoint = `/dynamic/serviceSection/${sectionId}/${type}/${item._id}`;
        await ngrokAxiosInstance.delete(endpoint);
        setItems(items.filter((i) => i._id !== item._id));
        console.log(`${item.type} deleted:`, item._id);
      } catch (error: any) {
        console.error(`Error deleting ${item.type.toLowerCase()}:`, error);
        setError(error.response?.data?.error || `Failed to delete ${item.type.toLowerCase()}`);
      }
    }
    setActiveMenu(null);
  };

  // Show loader or error
  if (loading) {
    return (
      <>
        <PageMeta
          title="Service Section Dashboard | TailAdmin - Next.js Admin Dashboard Template"
          description="Service Section Dashboard page for TailAdmin"
        />
        <div className="flex justify-between items-baseline mb-4">
          <PageBreadcrumb pageTitle="Service Section" />
        </div>
        <div className="space-y-6">
          <ComponentCard title="Service Section Table">
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
        title="Service Section Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="Service Section Dashboard page for TailAdmin"
      />
      <div className="flex justify-between items-center mb-4">
        <PageBreadcrumb pageTitle="Service Section" />
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleCreateClick('Service')}
            className="px-4 py-2 text-black! border-gray-200 bg-white hover:bg-gray-50! border dark:border-gray-800"
            disabled={!sectionId} // Disable if sectionId is not available
          >
            Create New Service
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleCreateClick('Product')}
            className="px-4 py-2 text-black! border-gray-200 bg-white hover:bg-gray-50! border dark:border-gray-800"
            disabled={!sectionId} // Disable if sectionId is not available
          >
            Create New Product
          </Button>
        </div>
      </div>
      <div className="space-y-6">
        {error && <div className="text-red-600 dark:text-red-400 mb-4">{error}</div>}
        <ComponentCard title="Service Section Table">
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
                      Type
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
                      Icon
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
                  {items.map((item, index) => (
                    <TableRow key={item._id}>
                      <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                        {index + 1}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                        <Badge size="sm" color={item.type === 'Service' ? 'primary' : 'success'}>
                          {item.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                        {item.title}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                        {item.description}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                        {item.icon}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 relative">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleMenu(item._id)}
                          disabled={loading} // Disable actions during loading
                        >
                          <MoreVertical className="size-5 text-gray-500 dark:text-gray-400" />
                        </Button>
                        {activeMenu === item._id && (
                          <div
                            ref={dropdownRef}
                            className="absolute top-4 right-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10"
                          >
                            <div className="">
                              <button
                                className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={() => handleEditClick(item)}
                              >
                                Edit
                              </button>
                              <button
                                className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={() => handleDeleteClick(item)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}