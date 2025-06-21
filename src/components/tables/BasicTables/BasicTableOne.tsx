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
import { MoreVertical,  } from "lucide-react";
import { useNavigate } from 'react-router';


// Define the Review interface based on the API data structure
interface Review {
  _id: string;
  rating: number;
  user_name: string;
  comments: string;
  company: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function BasicTableOne() {
 
  const [reviews, setReviews] = useState<Review[]>([]);
 
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await ngrokAxiosInstance.get('/dynamic/review');
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
    fetchReviews();
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


  const handleEditClick = (review: Review) => {
    console.log('Edit review:', review);
    navigate(`/reviews/edit/${review._id}`);
    setActiveMenu(null);
  };

  // Handle Delete action
  const handleDeleteClick = async (review: Review) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await ngrokAxiosInstance.delete(`/dynamic/review/${review._id}`);
        setReviews(reviews.filter((r) => r._id !== review._id));
        console.log('Review deleted:', review._id);
      } catch (error) {
        console.error('Error deleting review:', error);
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
                Rating
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                User Name
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Comments
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Company
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
            {reviews.map((review, index) => (
              <TableRow key={review._id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                  {index + 1}
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge size="sm" color="success">
                    {review.rating}
                  </Badge>
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                  {review.user_name}
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                  {review.comments}
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                  {review.company}
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 relative">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleMenu(review._id)}
                  >
                    <MoreVertical className="size-5 text-gray-500 dark:text-gray-400" />
                  </Button>
                  {activeMenu === review._id && (
                    <div
                      ref={dropdownRef}
                      className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10"
                    >
                      <div className="py-2">
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => handleEditClick(review)}
                        >
                          Edit
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => handleDeleteClick(review)}
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