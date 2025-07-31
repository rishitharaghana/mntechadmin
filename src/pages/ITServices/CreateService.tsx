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

interface FormErrors {
  title?: string;
  description?: string;
  icon?: string;
}

export default function CreateServiceForm() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    icon: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const parentId = location.state?.parentId as string | undefined;

  useEffect(() => {
    if (!parentId) {
      setServerError('Parent section ID is required');
    }
  }, [parentId]);

  // Validation functions
  const validateTitle = (title: string): string | undefined => {
    if (!title) return 'Title is required';
    if (title.length < 3) return 'Title must be at least 3 characters long';
    if (title.length > 100) return 'Title cannot exceed 100 characters';
    if (!/^[a-zA-Z\s\-',.!]+$/.test(title))
      return 'Title can only contain letters, spaces, and basic punctuation (no numbers)';
    return undefined;
  };

  const validateDescription = (description: string): string | undefined => {
    if (!description) return 'Description is required';
    if (description.length < 10) return 'Description must be at least 10 characters long';
    if (description.length > 500) return 'Description cannot exceed 500 characters';
    return undefined;
  };

  const validateIcon = (icon: string): string | undefined => {
    if (!icon) return 'Icon is required';
    if (icon.length > 255) return 'Icon field cannot exceed 255 characters';
    if (!/^[a-zA-Z0-9\-_]+$/.test(icon))
      return 'Icon can only contain letters, numbers, hyphens, and underscores';
    return undefined;
  };

  const validateForm = (): FormErrors => {
    return {
      title: validateTitle(formData.title),
      description: validateDescription(formData.description),
      icon: validateIcon(formData.icon),
    };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate on change to show errors immediately
    const validationError =
      name === 'title'
        ? validateTitle(value)
        : name === 'description'
        ? validateDescription(value)
        : validateIcon(value);
    setErrors((prev) => ({ ...prev, [name]: validationError }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentId) return;

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.values(validationErrors).some((error) => error)) {
      return;
    }

    setLoading(true);
    setServerError(null);

    try {
      await ngrokAxiosInstance.post(`/serviceSection/${parentId}/itServices`, formData);
      navigate('/it-services'); // Redirect to the table page after success
    } catch (err: any) {
      setServerError(err.response?.data?.error || 'Failed to create service');
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
        {serverError && <div className="text-red-500 mb-4">{serverError}</div>}
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
              className={`mt-1 ${errors.title ? 'border-red-500' : ''}`}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
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
              className={`mt-1 ${errors.description ? 'border-red-500' : ''}`}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
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
              placeholder="e.g., star-icon"
              className={`mt-1 ${errors.icon ? 'border-red-500' : ''}`}
            />
            {errors.icon && <p className="text-red-500 text-sm mt-1">{errors.icon}</p>}
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