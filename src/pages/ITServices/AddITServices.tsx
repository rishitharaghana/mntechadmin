import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import ngrokAxiosInstance from '../../hooks/axiosInstance';
import ComponentCard from '../../components/common/ComponentCard';
import Label from '../../components/form/Label';
import Input from '../../components/form/input/InputField';
import Button from '../../components/ui/button/Button';
import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';

// Define the ITService interface for form data
interface ITServiceFormData {
  title: string;
  description: string;
  icon: string;
}

export default function AddITServices() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const parentId = state?.parentId || '68563d750ea11f5d6792298a'; // Fallback to hardcoded ID

  // State for form fields
  const [formData, setFormData] = useState<ITServiceFormData>({
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
  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setError('IT Service title is required');
      return;
    }
    if (formData.title.length > 100) {
      setError('IT Service title must be 100 characters or less');
      return;
    }
    if (!formData.description.trim()) {
      setError('IT Service description is required');
      return;
    }
    if (formData.description.length > 500) {
      setError('IT Service description must be 500 characters or less');
      return;
    }
    if (!formData.icon.trim()) {
      setError('Icon is required');
      return;
    }
    if (formData.icon.length > 50) {
      setError('Icon name must be 50 characters or less');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await ngrokAxiosInstance.post(`/dynamic/serviceSection/${parentId}/itServices`, {
        title: formData.title,
        description: formData.description,
        icon: formData.icon,
      });
      alert('IT Service added successfully!');
      navigate(-1, { state: { refresh: true } }); // Signal refresh
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add IT service');
      console.error('Error adding IT service:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <>
      <PageMeta
        title="React.js Add IT Service | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Add IT Service page for TailAdmin - MN techs Admin Dashboard"
      />
      <div className="flex justify-between items-center mb-4">
        <PageBreadcrumb pageTitle="Add IT Service" />
      </div>
      <div className="space-y-6">
        <ComponentCard title="Add IT Service">
          <div className="space-y-6">
            <div>
              <Label htmlFor="title">IT Service Title</Label>
              <Input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter IT service title"
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
                placeholder="Enter IT service description"
                disabled={loading}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
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
                disabled={loading}
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
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </div>z
        </ComponentCard>
      </div>
    </>
  );
}