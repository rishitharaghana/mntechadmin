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
import { useNavigate } from 'react-router';
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
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [parentId, setParentId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServiceSection = async () => {
      try {
        setLoading(true);
        const response = await ngrokAxiosInstance.get('/dynamic/serviceSection');
        const data: ServiceSection = response.data;
        setParentId(data._id);
        const combinedItems: TableItem[] = [
          ...data.itServices.map((item) => ({ ...item, type: 'Service' as const })),
          ...data.products.map((item) => ({ ...item, type: 'Product' as const })),
        ];
        setItems(combinedItems);
      } catch (error) {
        console.error('Error fetching service section:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServiceSection();
  }, []);

  const toggleMenu = (id: string) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEditClick = (item: TableItem) => {
    navigate(`/it-services/edit/${item.type.toLowerCase()}/${item._id}`, {
      state: { parentId },
    });
    setActiveMenu(null);
  };

  const handleDeleteClick = async (item: TableItem) => {
    if (window.confirm(`Are you sure you want to delete this ${item.type.toLowerCase()}?`)) {
      try {
// Correct
const endpoint = `/dynamic/serviceSection/${parentId}/${item.type === 'Service' ? 'itServices' : 'products'}/${item._id}`;
        await ngrokAxiosInstance.delete(endpoint);
        setItems(items.filter((i) => i._id !== item._id));
      } catch (error) {
        console.error(`Error deleting ${item.type.toLowerCase()}:`, error);
      }
      setActiveMenu(null);
    }
  };

  const handleCreateClick = () => {
    navigate('/it-services/create', { state: { parentId } });
  };

  if (loading) {
    return (
      <>
        <PageMeta title="React.js Service Section Dashboard | TailAdmin" description="Service Section Dashboard" />
        <div className="flex justify-between items-baseline mb-4">
          <PageBreadcrumb pageTitle="Service Section" />
        </div>
        <ComponentCard title="Service Section Table">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="size-6 text-gray-500 animate-spin" />
            <span className="ml-2 text-gray-500">Loading...</span>
          </div>
        </ComponentCard>
      </>
    );
  }

  return (
    <>
      <PageMeta title="React.js Service Section Dashboard | TailAdmin" description="Service Section Dashboard" />
      <div className="flex justify-between items-center mb-4">
        <PageBreadcrumb pageTitle="Service Section" />
        <Button
          variant="primary"
          size="sm"
          onClick={handleCreateClick}
          className="px-4 py-2 text-black! border-gray-200 bg-white hover:bg-gray-50! border dark:border-gray-800"
        >
          Create New
        </Button>
      </div>
      <ComponentCard title="Service Section Table">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3">Sl.No</TableCell>
                  <TableCell isHeader className="px-5 py-3">Type</TableCell>
                  <TableCell isHeader className="px-5 py-3">Title</TableCell>
                  <TableCell isHeader className="px-5 py-3">Description</TableCell>
                  <TableCell isHeader className="px-5 py-3">Icon</TableCell>
                  <TableCell isHeader className="px-5 py-3">Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={item._id}>
                    <TableCell className="px-5 py-4">{index + 1}</TableCell>
                    <TableCell className="px-5 py-4">
                      <Badge size="sm" color={item.type === 'Service' ? 'primary' : 'success'}>
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4">{item.title}</TableCell>
                    <TableCell className="px-5 py-4">{item.description}</TableCell>
                    <TableCell className="px-5 py-4">{item.icon}</TableCell>
                    <TableCell className="px-5 py-4 relative">
                      <Button variant="outline" size="sm" onClick={() => toggleMenu(item._id)}>
                        <MoreVertical className="size-5" />
                      </Button>
                      {activeMenu === item._id && (
                        <div
                          ref={dropdownRef}
                          className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-10"
                        >
                          <div className="py-2">
                            <button
                              className="w-full text-left px-4 py-2 hover:bg-gray-100"
                              onClick={() => handleEditClick(item)}
                            >
                              Edit
                            </button>
                            <button
                              className="w-full text-left px-4 py-2 hover:bg-gray-100"
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
    </>
  );
}
