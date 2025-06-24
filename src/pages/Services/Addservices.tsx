
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import ngrokAxiosInstance from '../../hooks/axiosInstance';
import ComponentCard from '../../components/common/ComponentCard';
import Label from '../../components/form/Label';
import Input from '../../components/form/input/InputField';
import Button from '../../components/ui/button/Button';

// Define the Service interface for form data
interface ServiceFormData {
  title: string;
  description: string;
}

export default function AddServices() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const parentId = state?.parentId || '68563d750ea11f5d6792298a'; // Fallback to hardcoded ID

  // State for form fields
  const [formData, setFormData] = useState<ServiceFormData>({
    title: '',
    description: '',
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

    setLoading(true);
    setError(null);
    try {
      await ngrokAxiosInstance.post(`/dynamic/ourSkills/${parentId}/service`, {
        title: formData.title,
        description: formData.description,
      });
      alert('Service added successfully!');
      navigate(-1, { state: { refresh: true } }); // Signal refresh
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add service');
      console.error('Error adding service:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <ComponentCard title="Add Service">
      <div className="space-y-6">
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
      </div>
    </ComponentCard>
  );
}