import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router'; // Fixed import to use react-router-dom
import ngrokAxiosInstance from '../../hooks/axiosInstance';
import ComponentCard from '../../components/common/ComponentCard';
import Label from '../../components/form/Label';
import Select from '../../components/form/Select';
import Input from '../../components/form/input/InputField';
import Button from '../../components/ui/button/Button';

// Define the Review interface based on the API data structure
interface Review {
  _id: string;
  rating: number;
  user_name: string;
  comments: string;
  company: string;
  avatar: string;
}


const ratingOptions = [
  { value: '1', label: '1 Star' },
  { value: '2', label: '2 Stars' },
  { value: '3', label: '3 Stars' },
  { value: '4', label: '4 Stars' },
  { value: '5', label: '5 Stars' },
];

export default function EditReview() {
  // Get review ID from URL params
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State for form fields
  const [review, setReview] = useState<Review | null>(null);
  const [formData, setFormData] = useState({
    rating: '',
    user_name: '',
    comments: '',
    company: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch review data on component mount
  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await ngrokAxiosInstance.get(`/dynamic/review/${id}`);
        setReview(response.data);
        setFormData({
          rating: response.data.rating.toString(),
          user_name: response.data.user_name,
          comments: response.data.comments,
          company: response.data.company,
        });
      } catch (err) {
        setError('Failed to fetch review data');
        console.error('Error fetching review:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchReview();
    }
  }, [id]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select change for rating
  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, rating: value }));
  };

  // Handle submit action
  const handleSubmit = async () => {
    try {
      await ngrokAxiosInstance.put(`/dynamic/review/${id}`, {
        rating: parseInt(formData.rating),
        user_name: formData.user_name,
        comments: formData.comments,
        company: formData.company,
        avatar: review?.avatar || 'https://example.com/image.jpg',
      });
      alert('Review updated successfully!');
      navigate(-1);
    } catch (err) {
      setError('Failed to update review');
      console.error('Error updating review:', err);
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !review) {
    return <div>{error || 'Review not found'}</div>;
  }

  return (
    <ComponentCard title="Edit Review">
      <div className="space-y-6">
        <div>
          <Label htmlFor="rating">Rating</Label>
          <Select
            options={ratingOptions}
            placeholder="Select a rating"
            defaultValue={formData.rating}
            onChange={handleSelectChange}
            className="dark:bg-dark-900"
          />
        </div>
        <div>
          <Label htmlFor="user_name">User Name</Label>
          <Input
            type="text"
            id="user_name"
            name="user_name"
            value={formData.user_name}
            onChange={handleInputChange}
            placeholder="Enter user name"
          />
        </div>
        <div>
          <Label htmlFor="comments">Comments</Label>
          <Input
            type="text"
            id="comments"
            name="comments"
            value={formData.comments}
            onChange={handleInputChange}
            placeholder="Enter comments"
          />
        </div>
        <div>
          <Label htmlFor="company">Company</Label>
          <Input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            placeholder="Enter company name"
          />
        </div>
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        <div className="flex gap-4">
          <Button
            
            variant="outline"
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 dark:text-gray-200"
          >
            Cancel
          </Button>
          <Button
          
            variant="primary"
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
          >
            Submit
          </Button>
        </div>
      </div>
    </ComponentCard>
  );
}