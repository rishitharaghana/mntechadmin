import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import ngrokAxiosInstance from '../../hooks/axiosInstance';
import ComponentCard from '../../components/common/ComponentCard';
import Label from '../../components/form/Label';
import Input from '../../components/form/input/InputField';
import Button from '../../components/ui/button/Button';

// Define the Item interface based on the API data structure
interface Item {
  _id: string;
  title: string;
  description: string;
  icon: string;
}

export default function EditIISevices() {
  const { id, type } = useParams<{ id: string; type: 'service' | 'product' }>();
  const navigate = useNavigate();

  // State for form fields
  const [item, setItem] = useState<Item | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch item data on component mount
  useEffect(() => {
    const fetchItem = async () => {
      if (!type || !id) {
        setError('Invalid type or ID');
        setLoading(false);
        return;
      }

      try {
        const endpoint = `/dynamic/serviceSection/${type}${id}`; // e.g., /dynamic/serviceSection/itServices/:id or /dynamic/serviceSection/products/:id
        const response = await ngrokAxiosInstance.get(endpoint);
        setItem(response.data);
        setFormData({
          title: response.data.title || '',
          description: response.data.description || '',
          icon: response.data.icon || '',
        });
      } catch (err) {
        setError(`Failed to fetch ${type} data`);
        console.error(`Error fetching ${type}:`, err);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, type]);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle submit action
  const handleSubmit = async () => {
    if (!type) {
      setError('Invalid type');
      return;
    }

    try {
      const endpoint = `/dynamic/serviceSection/${type}s/${id}`;
      await ngrokAxiosInstance.put(endpoint, {
        title: formData.title,
        description: formData.description,
        icon: formData.icon,
      });
      alert(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully!`);
      navigate(-1);
    } catch (err) {
      setError(`Failed to update ${type}`);
      console.error(`Error updating ${type}:`, err);
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) {
    return <div className="text-gray-500 dark:text-gray-400">Loading...</div>;
  }

  if (error || !item) {
    return <div className="text-red-500">{error || `${type} not found`}</div>;
  }

  return (
  <ComponentCard title={`Edit ${(type as string).charAt(0).toUpperCase() + (type as string).slice(1)}`}>
    <div className="space-y-6">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Enter title"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-dark-900 dark:border-gray-600 dark:text-gray-200"
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Enter description"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-dark-900 dark:border-gray-600 dark:text-gray-200"
          rows={5}
        />
      </div>
      <div>
        <Label htmlFor="icon">Icon</Label>
        <Input
          type="text"
          id="icon"
          name="icon"
          value={formData.icon}
          onChange={handleInputChange}
          placeholder="Enter icon name (e.g., Cloud)"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-dark-900 dark:border-gray-600 dark:text-gray-200"
        />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
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