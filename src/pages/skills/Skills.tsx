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

// Define the Skill interface
interface Skill {
  _id: string;
  name: string;
  percentage: number;
}

// Define the parent API response interface
interface SkillApiResponse {
  _id: string;
  title: string;
  description: string;
  highlight: string;
  skills: Skill[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  buttonLink: string;
  buttonText: string;
}

export default function SkillsTable() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [parentId, setParentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch skills from the API
  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);
      try {
        const response = await ngrokAxiosInstance.get<SkillApiResponse | SkillApiResponse[]>('/dynamic/ourSkills');
        console.log('API Response:', response.data);
        let skillsData: Skill[] = [];
        let parentIdTemp: string | null = null;

        // Handle single object or array response
        if (Array.isArray(response.data)) {
          skillsData = response.data.flatMap((parent) => (Array.isArray(parent.skills) ? parent.skills : []));
          parentIdTemp = response.data[0]?._id || null; // Use first parent's ID
        } else {
          skillsData = Array.isArray(response.data.skills) ? response.data.skills : [];
          parentIdTemp = response.data._id || null;
        }

        setSkills(skillsData);
        setParentId(parentIdTemp);
      } catch (error) {
        console.error('Error fetching skills:', error);
        setSkills([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
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
    navigate('/skills/create', { state: { parentId } });
    setActiveMenu(null);
  };

  // Handle Edit action
 const handleEditClick = (skill: Skill) => {
  navigate(`/skills/edit/${skill._id}`, { state: { parentId } });
  setActiveMenu(null);
};

  // Handle Delete action
  const handleDeleteClick = async (skill: Skill) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        if (!parentId) throw new Error('Parent ID not available');
        await ngrokAxiosInstance.delete(`/dynamic/ourSkills/${parentId}/skill/${skill._id}`);
        setSkills(skills.filter((s) => s._id !== skill._id));
        console.log('Skill deleted:', skill._id);
      } catch (error) {
        console.error('Error deleting skill:', error);
      }
    }
    setActiveMenu(null);
  };

  // Show loader while fetching data
  if (loading) {
    return (
      <>
        <PageMeta
          title="React.js Skills Dashboard | TailAdmin - Next.js Admin Dashboard Template"
          description="This is React.js Skills Dashboard page for TailAdmin - MN techs Admin Dashboard"
        />
        <PageBreadcrumb pageTitle="Skills" />
        <div className="space-y-6">
          <ComponentCard title="Skills Table">
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
        title="React.js Skills Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Skills Dashboard page for TailAdmin - MN techs Admin Dashboard"
      />
      <PageBreadcrumb pageTitle="Skills" />
      <div className="space-y-6">
        {/* Add Skill Button Below Breadcrumb */}
        <div className="flex justify-end">
          <Button
            variant="primary"
            onClick={handleCreateClick}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
            aria-label="Add new skill"
          >
            Add Skill
          </Button>
        </div>
        <ComponentCard title="Skills Table">
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
                      Name
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Percentage
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
                  {Array.isArray(skills) && skills.length > 0 ? (
                    skills.map((skill, index) => (
                      <TableRow key={skill._id}>
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                          {index + 1}
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                          {skill.name}
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                          {skill.percentage}%
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 relative">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleMenu(skill._id)}
                          >
                            <MoreVertical className="size-5 text-gray-500 dark:text-gray-400" />
                          </Button>
                          {activeMenu === skill._id && (
                            <div
                              ref={dropdownRef}
                              className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-5"
                            >
                              <div className="py-2">
                                <button
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onClick={() => handleEditClick(skill)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onClick={() => handleDeleteClick(skill)}
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
                        No skills available
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