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
import { MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router';

// Define the Item interface for itServices and products
interface Item {
  _id: string;
  title: string;
  description: string;
  icon: string;
}

// Define the ServiceSection interface based on the API data structure
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

// Combined item type for table display
interface TableItem extends Item {
  type: 'Service' | 'Product';
}

export default function ServiceSectionTable() {
  const [items, setItems] = useState<TableItem[]>([]);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fetch service section data
  useEffect(() => {
    const fetchServiceSection = async () => {
      try {
        const response = await ngrokAxiosInstance.get('/dynamic/serviceSection');
        const data: ServiceSection = response.data;
        // Combine itServices and products into a single array with type
        const combinedItems: TableItem[] = [
          ...data.itServices.map((item) => ({ ...item, type: 'Service' as const })),
          ...data.products.map((item) => ({ ...item, type: 'Product' as const })),
        ];
        setItems(combinedItems);
      } catch (error) {
        console.error('Error fetching service section:', error);
      }
    };
    fetchServiceSection();
  }, []);

  // Toggle dropdown menu
  const toggleMenu = (id: string) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

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

  // Handle Edit action
  const handleEditClick = (item: TableItem) => {
    console.log('Edit item:', item);
    navigate(`/it-services/edit/${item.type.toLowerCase()}/${item._id}`);
    setActiveMenu(null);
  };

  // Handle Delete action
  const handleDeleteClick = async (item: TableItem) => {
    if (window.confirm(`Are you sure you want to delete this ${item.type.toLowerCase()}?`)) {
      try {
        const endpoint = `/dynamic/serviceSection/${item.type.toLowerCase()}s/${item._id}`;
        await ngrokAxiosInstance.delete(endpoint);
        setItems(items.filter((i) => i._id !== item._id));
        console.log(`${item.type} deleted:`, item._id);
      } catch (error) {
        console.error(`Error deleting ${item.type.toLowerCase()}:`, error);
      }
    }
    setActiveMenu(null);
  };

  // Handle Create action (duplicate with pre-filled data)
  const handleCreateClick = (item: TableItem) => {
    console.log('Create new item based on:', item);
    navigate(`/it-services/create`, { state: { prefill: item } });
    setActiveMenu(null);
  };

  return (
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
                  >
                    <MoreVertical className="size-5 text-gray-500 dark:text-gray-400" />
                  </Button>
                  {activeMenu === item._id && (
                    <div
                      ref={dropdownRef}
                      className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10"
                    >
                      <div className="py-2">
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => handleCreateClick(item)}
                        >
                          Create
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => handleEditClick(item)}
                        >
                          Edit
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
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
  );
}