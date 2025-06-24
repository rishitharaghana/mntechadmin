import { useEffect, useRef, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../../ui/table';
import Badge from '../../ui/badge/Badge';
import ngrokAxiosInstance from '../../../hooks/axiosInstance';
import Button from '../../ui/button/Button';
import { MoreVertical } from "lucide-react";
import { useNavigate } from 'react-router';

// Define the Hero interface based on the API data structure
interface Hero {
  _id: string;
  title_lines: string;
  subheading: string;
  subhighlight: string;
  description: string;
  button_text: string;
  image: string[];
  features: string[];
  intro_heading: string;
  intro_highlight: string;
  paragraph_text: string;
  button_path: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function BasicTableOne() {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const response = await ngrokAxiosInstance.get('/dynamic/hero');
        setHeroes(response.data);
      } catch (error) {
        console.error('Error fetching heroes:', error);
      }
    };
    fetchHeroes();
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

  const handleEditClick = (hero: Hero) => {
    console.log('Edit hero:', hero);
    navigate(`/heroes/edit/${hero._id}`);
    setActiveMenu(null);
  };

  const handleDeleteClick = async (hero: Hero) => {
    if (window.confirm('Are you sure you want to delete this hero?')) {
      try {
        await ngrokAxiosInstance.delete(`/dynamic/hero/${hero._id}`);
        setHeroes(heroes.filter((h) => h._id !== hero._id));
        console.log('Hero deleted:', hero._id);
      } catch (error) {
        console.error('Error deleting hero:', error);
      }
    }
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
                Title
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Subheading
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
                Button Text
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
            {heroes.map((hero, index) => (
              <TableRow key={hero._id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                  {index + 1}
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                  {hero.title_lines}
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                  {hero.subheading}
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                  {hero.description}
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge size="sm" color="success">
                    {hero.button_text}
                  </Badge>
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 relative">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleMenu(hero._id)}
                  >
                    <MoreVertical className="size-5 text-gray-500 dark:text-gray-400" />
                  </Button>
                  {activeMenu === hero._id && (
                    <div
                      ref={dropdownRef}
                      className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10"
                    >
                      <div className="py-2">
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => handleEditClick(hero)}
                        >
                          Edit
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => handleDeleteClick(hero)}
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