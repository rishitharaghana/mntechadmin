import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';

import ComponentCard from '../../components/common/ComponentCard';
import Label from '../../components/form/Label';
import Input from '../../components/form/input/InputField';
import Button from '../../components/ui/button/Button';
import { Loader2 } from 'lucide-react';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import ngrokAxiosInstance from '../../hooks/axiosInstance';

// Define the Service interface for form data
interface ServiceFormData {
  title: string;
  description: string;
  icon?: string;
}

export default function AddServices() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const parentId = state?.parentId || '685a7586a5646909c426b63c'; // Use provided parent ID

  // State for form fields and UI
  const [formData, setFormData] = useState<ServiceFormData>({
    title: '',
    description: '',
    icon: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Warn if parentId is missing
  React.useEffect(() => {
    if (!state?.parentId) {
      console.warn('parentId not provided; using fallback ID:', parentId);
    }
  }, [state, parentId]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle submit action
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
      await ngrokAxiosInstance.post(
        `/dynamic/service/${parentId}/service-item`,
        {
          title: formData.title,
          description: formData.description,
          icon: formData.icon || undefined, // Send undefined if icon is empty
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      alert('Service added successfully!');
      navigate('/services', { state: { refresh: true } });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add service item');
      console.error('Error adding service item:', err);
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
        <span className="ml-2 text-gray-500">Submitting...</span>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Add Service Item | TailAdmin - Next.js Admin Dashboard Template"
        description="Add a new service item"
      />
      <PageBreadcrumb pageTitle="Add Service Item" />
      <ComponentCard title="Add Service Item">
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
              disabled={loading}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
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
              {loading ? (
                <span className="flex items-center">
                  <Loader2 className="size-5 animate-spin mr-2" />
                  Submitting...
                </span>
              ) : (
                'Submit'
              )}
            </Button>
          </div>
        </form>
      </ComponentCard>
    </>
  );
}