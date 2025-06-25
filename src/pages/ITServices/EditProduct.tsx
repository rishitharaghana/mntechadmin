import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router';
import ngrokAxiosInstance from '../../hooks/axiosInstance';
import Button from '../../components/ui/button/Button';
import Input from '../../components/form/input/InputField';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import ComponentCard from '../../components/common/ComponentCard';
import { Loader2 } from 'lucide-react';

interface FormData {
  title: string;
  description: string;
  icon: string;
}

export default function EditProductForm() {
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
    // Fix: Corrected syntax error and added curly braces for clarity
    if (!parentId || !itemId) {
      setError('Parent section ID or item ID is required');
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await ngrokAxiosInstance.get(
          `/dynamic/serviceSection/${parentId}/products/${itemId}`
        );
        setFormData({
          title: response.data.title,
          description: response.data.description,
          icon: response.data.icon,
        });
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [parentId, itemId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentId || !itemId) {
      setError('Parent section ID or item ID is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await ngrokAxiosInstance.put(
        `/dynamic/serviceSection/${parentId}/products/${itemId}`,
        formData
      );
      // Enhancement: Pass state to trigger table refresh if needed
      navigate('/it-services', { state: { refetch: true } });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update product');
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
        title="Edit Product | TailAdmin - Next.js Admin Dashboard Template"
        description="Edit an existing Product"
      />
      <div className="flex justify-between items-baseline mb-4">
        <PageBreadcrumb pageTitle="Edit Product" />
      </div>
      <ComponentCard title="Edit Product">
        {error && <div className="text-red-600 dark:text-red-400 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
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
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
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
            <label
              htmlFor="icon"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
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
              {loading ? 'Updating...' : 'Update Product'}
            </Button>
          </div>
        </form>
      </ComponentCard>
    </>
  );
}