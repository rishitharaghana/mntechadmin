import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router";
import ngrokAxiosInstance from "../../hooks/axiosInstance";
import Button from "../../components/ui/button/Button";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import { Loader2 } from "lucide-react";
import Input from "../../components/form/input/InputField";

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

export default function EditServiceForm() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    icon: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { itemId } = useParams<{ itemId: string }>();
  const parentId = location.state?.parentId as string | undefined;

  useEffect(() => {
    if (!parentId || !itemId) {
      setServerError("Parent section ID or item ID is required");
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
        setServerError(err.response?.data?.error || "Failed to fetch service");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [parentId, itemId]);

  // Validation functions
  const validateTitle = (title: string): string | undefined => {
    if (!title) return "Title is required";
    if (title.length < 3) return "Title must be at least 3 characters long";
    if (title.length > 100) return "Title cannot exceed 100 characters";
    if (!/^[a-zA-Z\s\-',.!]+$/.test(title))
      return "Title can only contain letters, spaces, and basic punctuation (no numbers)";
    return undefined;
  };

  const validateDescription = (description: string): string | undefined => {
    if (!description) return "Description is required";
    if (description.length < 10) return "Description must be at least 10 characters long";
    if (description.length > 500) return "Description cannot exceed 500 characters";
    return undefined;
  };

  const validateIcon = (icon: string): string | undefined => {
    if (!icon) return "Icon is required";
    if (icon.length > 255) return "Icon field cannot exceed 255 characters";
    if (!/^[a-zA-Z0-9\-_]+$/.test(icon))
      return "Icon can only contain letters, numbers, hyphens, and underscores";
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
      name === "title"
        ? validateTitle(value)
        : name === "description"
        ? validateDescription(value)
        : validateIcon(value);
    setErrors((prev) => ({ ...prev, [name]: validationError }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentId || !itemId) return;

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.values(validationErrors).some((error) => error)) {
      return;
    }

    setLoading(true);
    setServerError(null);

    try {
      await ngrokAxiosInstance.put(
        `/dynamic/serviceSection/${parentId}/itServices/${itemId}`,
        formData
      );
      navigate("/it-services");
    } catch (err: any) {
      setServerError(err.response?.data?.error || "Failed to update service");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !serverError) {
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
        {serverError && (
          <div className="text-red-600 dark:text-red-400 mb-4">{serverError}</div>
        )}
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
              className={`mt-1 ${errors.title ? "border-red-600" : ""}`}
            />
            {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
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
              className={`mt-1 ${errors.description ? "border-red-600" : ""}`}
            />
            {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
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
              placeholder="e.g., star-icon"
              className={`mt-1 ${errors.icon ? "border-red-600" : ""}`}
            />
            {errors.icon && <p className="text-red-600 text-sm mt-1">{errors.icon}</p>}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/it-services")}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button variant="primary" size="sm" disabled={loading}>
              {loading ? "Updating..." : "Update Service"}
            </Button>
          </div>
        </form>
      </ComponentCard>
    </>
  );
}