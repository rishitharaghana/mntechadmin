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

// Define errors for each field
interface FormErrors {
  title?: string;
  description?: string;
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
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(true);

  // Validation regex patterns
  const titleRegex = /^[a-zA-Z\s'-]*$/; // Only letters, spaces, apostrophes, hyphens
  const descriptionRegex = /^[a-zA-Z0-9\s.,!?'’-]*$/; // Alphanumeric, spaces, common punctuation
  const iconRegex = /^[a-zA-Z0-9_-]*$/; // Alphanumeric, hyphens, underscores (for icon names)

  // Fetch service item data on component mount
  useEffect(() => {
    const fetchServiceItem = async () => {
      try {
        if (!id) {
          throw new Error('Service item ID is missing');
        }
        console.log('Fetching service item with ID:', id, 'Parent ID:', parentId);
        const response = await ngrokAxiosInstance.get(`/service/${parentId}/service-item/${id}`);
        console.log('Fetched service item:', response.data);
        setService(response.data);
        setFormData({
          title: response.data.title || '',
          description: response.data.description || '',
          icon: response.data.icon || '',
        });
      } catch (err: any) {
        setErrors({ title: err.response?.data?.error || 'Failed to fetch service item' });
        console.error('Error fetching service item:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServiceItem();
  }, [id, parentId]);

  // Validate individual field
  const validateField = (name: keyof Service, value: string): string | undefined => {
    const trimmedValue = value.trim();
    if (name === 'title') {
      if (!trimmedValue) return 'Service title is required';
      if (trimmedValue.length < 3) return 'Service title must be at least 3 characters';
      if (trimmedValue.length > 100) return 'Service title must be 100 characters or less';
      if (!titleRegex.test(trimmedValue)) return 'Service title can only contain letters, spaces, apostrophes, and hyphens';
    } else if (name === 'description') {
      if (!trimmedValue) return 'Service description is required';
      if (trimmedValue.length < 10) return 'Service description must be at least 10 characters';
      if (trimmedValue.length > 500) return 'Service description must be 500 characters or less';
      if (!descriptionRegex.test(trimmedValue)) return 'Service description contains invalid characters';
    } else if (name === 'icon' && trimmedValue) {
      if (trimmedValue.length > 50) return 'Icon name must be 50 characters or less';
      if (!iconRegex.test(trimmedValue)) return 'Icon name contains invalid characters';
    }
    return undefined;
  };

  // Handle input changes with real-time validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate the changed field
    const error = validateField(name as keyof Service, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  // Validate all fields on submit
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    newErrors.title = validateField('title', formData.title);
    newErrors.description = validateField('description', formData.description);
    newErrors.icon = validateField('icon', formData.icon || '');
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();
    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    setLoading(true);
    try {
      console.log('Updating service item with ID:', id, 'Parent ID:', parentId, 'Data:', formData);
      await ngrokAxiosInstance.put(`/service/${parentId}/service-item/${id}`, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        icon: formData.icon?.trim() || undefined, // Send undefined if icon is empty
      });
      alert('Service item updated successfully!');
      navigate('/services', { state: { refresh: true } });
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to update service item';
      setErrors({ title: errorMessage }); // Display API error as a title error
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

  if (!service) {
    return (
      <ComponentCard title="Edit Service">
        <div className="text-red-500">{errors.title || 'Service item not found'}</div>
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
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter service description"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-dark-900 dark:border-gray-600 dark:text-gray-200 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              rows={5}
              disabled={loading}
            />
            {errors.description && (
              <div className="text-red-500 text-sm mt-1">{errors.description}</div>
            )}
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
              className={errors.icon ? 'border-red-500' : ''}
            />
            {errors.icon && <div className="text-red-500 text-sm mt-1">{errors.icon}</div>}
          </div>
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
              type= "submit" 
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