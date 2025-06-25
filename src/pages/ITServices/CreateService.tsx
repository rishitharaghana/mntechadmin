import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import ngrokAxiosInstance from '../../hooks/axiosInstance';
import Button from '../../components/ui/button/Button';

import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import ComponentCard from '../../components/common/ComponentCard';
import Input from '../../components/form/input/InputField';

interface FormData {
  title: string;
  description: string;
  icon: string;
}

export default function CreateServiceForm() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    icon: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const parentId = location.state?.parentId as string | undefined;

  useEffect(() => {
    if (!parentId) {
      setError('Parent section ID is required');
    }
  }, [parentId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentId) return;

    setLoading(true);
    setError(null);

    try {
      await ngrokAxiosInstance.post(`/dynamic/serviceSection/${parentId}/itServices`, formData);
      navigate('/it-services'); // Redirect to the table page after success
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Create IT Service | TailAdmin - Next.js Admin Dashboard Template"
        description="Create a new IT Service"
      />
      <div className="flex justify-between items-baseline mb-4">
        <PageBreadcrumb pageTitle="Create IT Service" />
      </div>
      <ComponentCard title="Create New IT Service">
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <Input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
             
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <Input
              id="description"
              name="description"
              type="text"
              value={formData.description}
              onChange={handleChange}
            
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="icon" className="block text-sm font-medium text-gray-700">
              Icon
            </label>
            <Input
              id="icon"
              name="icon"
              type="text"
              value={formData.icon}
              onChange={handleChange}
              
              className="mt-1"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/it-services')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
            
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Service'}
            </Button>
          </div>
        </form>
      </ComponentCard>
    </>
  );
}