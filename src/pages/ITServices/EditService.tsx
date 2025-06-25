import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router';
import ngrokAxiosInstance from '../../hooks/axiosInstance';
import Button from '../../components/ui/button/Button';

import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import ComponentCard from '../../components/common/ComponentCard';
import { Loader2 } from 'lucide-react';
import Input from '../../components/form/input/InputField';

interface FormData {
  title: string;
  description: string;
  icon: string;
}

export default function EditServiceForm() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    icon: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { itemId } = useParams<{ itemId: string }>();
  const parentId = location.state?.parentId as string | undefined;

  useEffect(() => {
    if (!parentId || !itemId) {
      setError('Parent section ID or item ID is required');
      setLoading(false);
      return;
    }

    const fetchService = async () => {
      try {
        const response = await ngrokAxiosInstance.get(
          `/dynamic/serviceSection/${parentId}/itServices/${itemId}`
        );
        setFormData({
          title: response.data.title,
          description: response.data.description,
          icon: response.data.icon,
        });
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch service');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [parentId, itemId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentId || !itemId) return;

    setLoading(true);
    setError(null);

    try {
      await ngrokAxiosInstance.put(
        `/dynamic/serviceSection/${parentId}/itServices/${itemId}`,
        formData
      );
      navigate('/it-services'); // Redirect to the table page after success
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update service');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !error) {
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
        title="Edit IT Service | TailAdmin - Next.js Admin Dashboard Template"
        description="Edit an existing IT Service"
      />
      <div className="flex justify-between items-baseline mb-4">
        <PageBreadcrumb pageTitle="Edit IT Service" />
      </div>
      <ComponentCard title="Edit IT Service">
      {error && <div className="error text-red-600 dark:text-red-400">{error}</div>}
      <form onSubmit={handleSubmit}
      className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Title
          </label>
          <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1"
          />
        </div>
<div>
  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
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
      <label htmlFor="icon" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
        Icon
      </label>      <Input
        id="icon"
        name="text"
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
        {loading ? 'Updating...' : 'Update Service'}
      </Button>
    </div>
  </form>
</ComponentCard>
</>
)
}