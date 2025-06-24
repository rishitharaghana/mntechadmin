import { useEffect, useRef, useState } from 'react';
import { MoreVertical, Loader2 } from 'lucide-react'; // Added Loader2 for spinner
import { useNavigate } from 'react-router';
import ngrokAxiosInstance from '../../hooks/axiosInstance';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../components/ui/table';
import Badge from '../../components/ui/badge/Badge';
import Button from '../../components/ui/button/Button';
import ComponentCard from '../../components/common/ComponentCard';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';

// Define the Employee interface based on the API data structure
interface Employee {
  _id: string;
  name: string;
  designation: string;
  image: string;
  linkedin_url: string;
  twitter_url: string;
  instagram_url: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function AllEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // State for fetching loader
  const [deletingId, setDeletingId] = useState<string | null>(null); // State for deleting loader
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fetch employees data from the API
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true); // Start fetching loader
        const response = await ngrokAxiosInstance.get('/dynamic/team/');
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false); // Stop fetching loader
      }
    };
    fetchEmployees();
  }, []);

  // Toggle dropdown menu for actions
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

  // Handle edit action
  const handleEditClick = (employee: Employee) => {
    console.log('Edit employee:', employee);
    navigate(`/employees/edit/${employee._id}`);
    setActiveMenu(null);
  };

  // Handle delete action
  const handleDeleteClick = async (employee: Employee) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        setDeletingId(employee._id); // Start deleting loader for this employee
        await ngrokAxiosInstance.delete(`/dynamic/team/${employee._id}`);
        setEmployees(employees.filter((e) => e._id !== employee._id));
        console.log('Employee deleted:', employee._id);
      } catch (error) {
        console.error('Error deleting employee:', error);
      } finally {
        setDeletingId(null); // Stop deleting loader
        setActiveMenu(null);
      }
    } else {
      setActiveMenu(null);
    }
  };

  // Show loader while fetching data
  if (loading) {
    return (
      <>
        <PageMeta
          title="React.js Employee Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
          description="This is React.js Employee Tables Dashboard page for TailAdmin - MN techs Admin Dashboard"
        />
        <PageBreadcrumb pageTitle="Employee Tables" />
        <div className="space-y-6">
          <ComponentCard title="Basic Table 1">
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
        title="React.js Employee Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Employee Tables Dashboard page for TailAdmin - MN techs Admin Dashboard"
      />
      <PageBreadcrumb pageTitle="Employee Tables" />
      <div className="space-y-6">
        <ComponentCard title="Basic Table 1">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <Table>
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
                      Name
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Designation
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      LinkedIn
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
                  {employees.map((employee, index) => (
                    <TableRow key={employee._id}>
                      <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                        {index + 1}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                        {employee.name}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                        <Badge size="sm" color="success">
                          {employee.designation}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                        <a
                          href={employee.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          LinkedIn
                        </a>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 relative">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleMenu(employee._id)}
                          disabled={deletingId === employee._id} // Disable button during deletion
                        >
                          {deletingId === employee._id ? (
                            <Loader2 className="size-5 text-gray-500 animate-spin" />
                          ) : (
                            <MoreVertical className="size-5 text-gray-500 dark:text-gray-400" />
                          )}
                        </Button>
                        {activeMenu === employee._id && (
                          <div
                            ref={dropdownRef}
                            className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10"
                          >
                            <div className="py-2">
                              <button
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={() => handleEditClick(employee)}
                              >
                                Edit
                              </button>
                              <button
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={() => handleDeleteClick(employee)}
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