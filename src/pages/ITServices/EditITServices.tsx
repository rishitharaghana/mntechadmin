// components/EditITServices.tsx
import React, { useState, useEffect } from 'react';
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

export default function EditITServices() {
  const { type, itemId } = useParams<{ type: string; itemId: string }>();
  const navigate = useNavigate();
  const { state } = useLocation();
  const parentId = state?.parentId || '685850e7be8c11851011c83a';

  const [formData, setFormData] = useState<Item>({
    title: '',
    description: '',
    icon: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (itemId) {
      const fetchItem = async () => {
        try {
          const response = await ngrokAxiosInstance.get(
            `/dynamic/serviceSection/${parentId}/${type}s/${itemId}`
          );
          setFormData(response.data.data);
        } catch (err: any) {
          setError(err.response?.data?.error || 'Failed to fetch item data');
          console.error(`Error fetching ${type}:`, err);
        } finally {
          setLoading(false);
        }
      };
      fetchItem();
    } else {
      setLoading(false);
    }
  }, [itemId, parentId, type]);

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
      await ngrokAxiosInstance.put(`/dynamic/serviceSection/${parentId}/${type}s/${itemId}`, formData);
      alert(`${type} updated successfully!`);
      navigate('/it-services');
    } catch (err: any) {
      setError(err.response?.data?.error || `Failed to update ${type}`);
      console.error(`Error updating ${type}:`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/it-services');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="size-6 text-gray-500 animate-spin" />
        <span className="ml-2 text-gray-500">Loading...</span>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title={`Edit ${type} | TailAdmin`}
        description={`Edit a ${type} item`}
      />
      <PageBreadcrumb pageTitle={`Edit ${type}`} />
      <ComponentCard title={`Edit ${type}`}>
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