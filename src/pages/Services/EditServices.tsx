import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import ngrokAxiosInstance from '../../hooks/axiosInstance';
import ComponentCard from '../../components/common/ComponentCard';
import Label from '../../components/form/Label';
import Input from '../../components/form/input/InputField';
import Button from '../../components/ui/button/Button';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import { Loader2 } from 'lucide-react';


// Define the Service interface based on the API data structure
interface Service {
  _id: string;
  title: string;
  description: string;
  icon?: string;
}

export default function EditService() {
  const { id } = useParams<{ id: string }>(); // Service item ID
  const navigate = useNavigate();
  const { state } = useLocation();
  const parentId = state?.parentId || '685a7586a5646909c426b63c'; // Fallback parent ID
  const [service, setService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch service item data on component mount
  useEffect(() => {
    const fetchServiceItem = async () => {
      try {
        if (!id) {
          throw new Error('Service item ID is missing');
        }
        console.log('Fetching service item with ID:', id, 'Parent ID:', parentId);
        const response = await ngrokAxiosInstance.get(`/dynamic/service/${parentId}/service-item/${id}`);
        console.log('Fetched service item:', response.data);
        setService(response.data);
        setFormData({
          title: response.data.title || '',
          description: response.data.description || '',
          icon: response.data.icon || '',
        });
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch service item');
        console.error('Error fetching service item:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServiceItem();
  }, [id, parentId]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Service title is required');
      return;
    }
    if (formData.title.length > 100) {
      setError('Service title must be 100 characters or less');
      return;
    }
    if (!formData.description.trim()) {
      setError('Service description is required');
      return;
    }
    if (formData.description.length > 500) {
      setError('Service description must be 500 characters or less');
      return;
    }
    if (formData.icon && formData.icon.length > 50) {
      setError('Icon name must be 50 characters or less');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log('Updating service item with ID:', id, 'Parent ID:', parentId, 'Data:', formData);
      await ngrokAxiosInstance.put(`/dynamic/service/${parentId}/service-item/${id}`, {
        title: formData.title,
        description: formData.description,
        icon: formData.icon || undefined, // Send undefined if icon is empty to match backend
      });
      alert('Service item updated successfully!');
      navigate('/services', { state: { refresh: true } });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update service item');
      console.error('Error updating service item:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    navigate('/services');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="size-6 text-gray-500 animate-spin" />
        <span className="ml-2 text-gray-500">Loading...</span>
      </div>
    );
  }

  if (error || !service) {
    return (
      <ComponentCard title="Edit Service">
        <div className="text-red-500">{error || 'Service item not found'}</div>
      </ComponentCard>
    );
  }

  return (
    <>
      <PageMeta
        title="Edit Service Item | TailAdmin - Next.js Admin Dashboard Template"
        description="Edit an existing service item"
      />
      <PageBreadcrumb pageTitle="Edit Service Item" />
      <ComponentCard title="Edit Service Item">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Service Title</Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter service title"
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter service description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-dark-900 dark:border-gray-600 dark:text-gray-200"
              rows={5}
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="icon">Icon (Optional)</Label>
            <Input
              type="text"
              id="icon"
              name="icon"
              value={formData.icon}
              onChange={handleInputChange}
              placeholder="Enter icon name (e.g., zap)"
              disabled={loading}
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex gap-4 justify-end">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 dark:text-gray-200"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Save'}
            </Button>
          </div>
        </form>
      </ComponentCard>
    </>
  );
}