import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import ngrokAxiosInstance from '../../hooks/axiosInstance';
import ComponentCard from '../../components/common/ComponentCard';
import Label from '../../components/form/Label';
import Input from '../../components/form/input/InputField';
import Button from '../../components/ui/button/Button';

// Define the Skill interface for form data
interface SkillFormData {
  name: string;
  percentage: number;
}

export default function AddSkills() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const parentId = state?.parentId || '6856a9adba2983684f88c81a'; // Fallback to hardcoded ID

  // State for form fields
  const [formData, setFormData] = useState<SkillFormData>({
    name: '',
    percentage: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Warn if parentId is missing
  React.useEffect(() => {
    if (!state?.parentId) {
      console.warn('parentId not provided; using fallback ID:', parentId);
    }
  }, [state, parentId]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'percentage' ? Math.max(0, Math.min(100, Number(value))) : value,
    }));
  };

  // Handle submit action
  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError('Skill name is required');
      return;
    }
    if (formData.name.length > 50) {
      setError('Skill name must be 50 characters or less');
      return;
    }
    if (formData.percentage < 0 || formData.percentage > 100) {
      setError('Percentage must be between 0 and 100');
      return;
    }
    if (!Number.isInteger(formData.percentage)) {
      setError('Percentage must be an integer');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await ngrokAxiosInstance.post(`/dynamic/ourSkills/${parentId}/skill`, {
        name: formData.name,
        percentage: formData.percentage,
      });
      alert('Skill added successfully!');
      navigate(-1, { state: { refresh: true } }); // Signal refresh
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add skill');
      console.error('Error adding skill:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <ComponentCard title="Add Skill">
      <div className="space-y-6">
        <div>
          <Label htmlFor="name">Skill Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter skill name"
            disabled={loading}
            
          />
        </div>
        <div>
          <Label htmlFor="percentage">Percentage (0-100)</Label>
          <Input
          //   type="number"
            id="percentage"
            name="percentage"
            value={formData.percentage}
            onChange={handleInputChange}
            placeholder="Enter percentage"
            min={0}
            max={100}
            step={1}
            disabled={loading}
          />
        </div>
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        <div className="flex gap-4">
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
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </div>
    </ComponentCard>
  );
}