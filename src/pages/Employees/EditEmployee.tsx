import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router'; 
import ngrokAxiosInstance from '../../hooks/axiosInstance';
import ComponentCard from '../../components/common/ComponentCard';
import Label from '../../components/form/Label';
import Input from '../../components/form/input/InputField';
import Button from '../../components/ui/button/Button';

// Define the Employee interface based on the API data structure
interface Employee {
  _id: string;
  name: string;
  designation: string;
  linkedin_url: string;
  twitter_url: string;
  instagram_url: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function EditEmployee() {
  // Get employee ID from URL params
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State for form fields
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    linkedin_url: '',
    twitter_url: '',
    instagram_url: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch employee data on component mount
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await ngrokAxiosInstance.get(`/dynamic/team/${id}`);
        setEmployee(response.data);
        setFormData({
          name: response.data.name,
          designation: response.data.designation,
          linkedin_url: response.data.linkedin_url,
          twitter_url: response.data.twitter_url,
          instagram_url: response.data.instagram_url,
        });
      } catch (err) {
        setError('Failed to fetch employee data');
        console.error('Error fetching employee:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchEmployee();
    }
  }, [id]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle submit action
  const handleSubmit = async () => {
    try {
      await ngrokAxiosInstance.put(`/dynamic/team/${id}`, {
        name: formData.name,
        designation: formData.designation,
        linkedin_url: formData.linkedin_url,
        twitter_url: formData.twitter_url,
        instagram_url: formData.instagram_url,
        image: employee?.image || '', // Preserve existing image
      });
      alert('Employee updated successfully!');
      navigate(-1); // Navigate back to previous page
    } catch (err) {
      setError('Failed to update employee');
      console.error('Error updating employee:', err);
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    navigate(-1); // Navigate back to previous page
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !employee) {
    return <div>{error || 'Employee not found'}</div>;
  }

  return (
    <ComponentCard title="Edit Employee">
      <div className="space-y-6">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter employee name"
          />
        </div>
        <div>
          <Label htmlFor="designation">Designation</Label>
          <Input
            type="text"
            id="designation"
            name="designation"
            value={formData.designation}
            onChange={handleInputChange}
            placeholder="Enter designation"
          />
        </div>
        <div>
          <Label htmlFor="linkedin_url">LinkedIn URL</Label>
          <Input
            type="text"
            id="linkedin_url"
            name="linkedin_url"
            value={formData.linkedin_url}
            onChange={handleInputChange}
            placeholder="Enter LinkedIn URL"
          />
        </div>
        <div>
          <Label htmlFor="twitter_url">Twitter URL</Label>
          <Input
            type="text"
            id="twitter_url"
            name="twitter_url"
            value={formData.twitter_url}
            onChange={handleInputChange}
            placeholder="Enter Twitter URL"
          />
        </div>
        <div>
          <Label htmlFor="instagram_url">Instagram URL</Label>
          <Input
            type="text"
            id="instagram_url"
            name="instagram_url"
            value={formData.instagram_url}
            onChange={handleInputChange}
            placeholder="Enter Instagram URL"
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