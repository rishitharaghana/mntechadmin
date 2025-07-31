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

// Define errors for each field
interface FormErrors {
  title?: string;
  description?: string;
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
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  // Validation regex patterns
  const titleRegex = /^[a-zA-Z\s'-]*$/; // Only letters, spaces, apostrophes, hyphens
  const descriptionRegex = /^[a-zA-Z0-9\s.,!?'’-]*$/; // Alphanumeric, spaces, common punctuation
  const iconRegex = /^[a-zA-Z0-9_-]*$/; // Alphanumeric, hyphens, underscores (for icon names)

  // Warn if parentId is missing
  React.useEffect(() => {
    if (!state?.parentId) {
      console.warn('parentId not provided; using fallback ID:', parentId);
    }
  }, [state, parentId]);

  // Validate individual field
  const validateField = (name: keyof ServiceFormData, value: string): string | undefined => {
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
    const error = validateField(name as keyof ServiceFormData, value);
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

  // Handle submit action
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
      await ngrokAxiosInstance.post(
        `/service/${parentId}/service-item`,
        {
          title: formData.title.trim(),
          description: formData.description.trim(),
          icon: formData.icon?.trim() || undefined, // Send undefined if icon is empty
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      alert('Service added successfully!');
      navigate('/services', { state: { refresh: true } });
    } catch (err: unknown) {
      console.error('Error adding service:', err);
      let errorMessage = 'Failed to add service. Please try again.';
      if (err && typeof err === 'object' && 'response' in err) {
        const errorObj = err as { response?: { data?: { error?: string } } };
        errorMessage = errorObj.response?.data?.error || errorMessage;
      }
      setErrors({ title: errorMessage }); // Display API error as a title error for simplicity
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
              disabled={loading}
              rows={5}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
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
              type="submit"
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