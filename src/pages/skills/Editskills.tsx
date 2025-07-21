import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import ngrokAxiosInstance from "../../hooks/axiosInstance";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { Loader2 } from "lucide-react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

interface Skill {
  _id: string;
  name: string;
  percentage: number;
}

interface FormErrors {
  name?: string;
  percentage?: string;
}

export default function EditSkills() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state } = useLocation();
  const parentId = state?.parentId || "685a486732d957d421ab6cf9";

  const [formData, setFormData] = useState({
    name: "",
    percentage: "",
  });
  console.log("formData", formData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const nameRegex = /^[a-zA-Z\s'-]*$/;

  useEffect(() => {
    setFormData({
      name: state.name || "",
      percentage: state.percentage || "",
    });
  }, [id, parentId]);

  const validateField = (
    name: keyof Skill,
    value: string
  ): string | undefined => {
    const trimmedValue = value.trim();
    if (name === "name") {
      if (!trimmedValue) return "Skill name is required";
      if (trimmedValue.length < 3)
        return "Skill name must be at least 3 characters";
      if (trimmedValue.length > 100)
        return "Skill name must be 100 characters or less";
      if (!nameRegex.test(trimmedValue))
        return "Skill name can only contain letters, spaces, apostrophes, and hyphens";
    } else if (name === "percentage") {
      if (trimmedValue === "") return "Percentage is required";
      const numValue = Number(trimmedValue);
      if (isNaN(numValue)) return "Percentage must be a valid number";
      if (numValue < 0 || numValue > 100)
        return "Percentage must be between 0 and 100";
    }
    return undefined;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "percentage" ? value : value,
    }));

    const error = validateField(name as keyof Skill, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    newErrors.name = validateField("name", formData.name);
    newErrors.percentage = validateField(
      "percentage",
      formData.percentage.toString()
    );
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    setLoading(true);
    try {
      console.log(
        "Updating skill with ID:",
        id,
        "Parent ID:",
        parentId,
        "Data:",
        {
          name: formData.name.trim(),
          percentage: Number(formData.percentage),
        }
      );
      const response = await ngrokAxiosInstance.put(
        `/dynamic/ourSkills/${parentId}/skill/${id}`,
        {
          name: formData.name.trim(),
          percentage: Number(formData.percentage),
        }
      );
      console.log("Update Response:", response.data);
      alert("Skill updated successfully!");
      navigate("/skills", { state: { refresh: true } });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || "Failed to update skill";
      setErrors({ name: errorMessage });
      console.error("Error updating skill:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/skills");
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
        title="Edit Skill | TailAdmin - Next.js Admin Dashboard Template"
        description="Edit an existing skill"
      />
      <PageBreadcrumb pageTitle="Edit Skill" />
      <ComponentCard title="Edit Skill">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name SecondaryName">Skill Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter skill name"
              disabled={loading}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <div className="text-red-500 text-sm mt-1">{errors.name}</div>
            )}
          </div>
          <div>
            <Label htmlFor="percentage">Percentage (0-100)</Label>
            <Input
              type="number"
              id="percentage"
              name="percentage"
              value={formData.percentage}
              onChange={handleInputChange}
              placeholder="Enter percentage 0-100"
              disabled={loading}
              className={errors.percentage ? "border-red-500" : ""}
            />
            {errors.percentage && (
              <div className="text-red-500 text-sm mt-1">
                {errors.percentage}
              </div>
            )}
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
                "Save"
              )}
            </Button>
          </div>
        </form>
      </ComponentCard>
    </>
  );
}
