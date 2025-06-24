// components/AddITServices.tsx
import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import ngrokAxiosInstance from '../../hooks/axiosInstance';
import ComponentCard from '../../components/common/ComponentCard';
import Label from '../../components/form/Label';
import Input from '../../components/form/input/InputField';
import Button from '../../components/ui/button/Button';
import { Loader2 } from 'lucide-react';

import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';

interface Item {
  title: string;
  description: string;
  icon: string;
}

export default function AddITServices() {
  const { type } = useParams<{ type: string }>(); // 'service' or 'product'
  const navigate = useNavigate();
  const { state } = useLocation();
  const parentId = state?.parentId || '685850e7be8c11851011c83a'; // Fallback ID

  const [formData, setFormData] = useState<Item>({
    title: '',
    description: '',
    icon: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.icon) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const endpoint = `/dynamic/serviceSection/${parentId}/${type}s`;
      await ngrokAxiosInstance.post(endpoint, formData);
      alert(`${type} created successfully!`);
      navigate('/it-services');
    } catch (err: any) {
      setError(err.response?.data?.error || `Failed to create ${type}`);
      console.error(`Error creating ${type}:`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/it-services');
  };

  return (
    <>
      <PageMeta
        title={`Create ${type} | TailAdmin`}
        description={`Create a new ${type} item`}
      />
      <PageBreadcrumb pageTitle={`Create ${type}`} />
      <ComponentCard title={`Create ${type}`}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter title"
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter description"
              disabled={loading}
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
              placeholder="Enter icon name"
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
                'Save'
              )}
            </Button>
          </div>
        </form>
      </ComponentCard>
    </>
  );
}