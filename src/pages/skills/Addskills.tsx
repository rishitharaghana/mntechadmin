import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import ngrokAxiosInstance from '../../hooks/axiosInstance';
import ComponentCard from '../../components/common/ComponentCard';
import Label from '../../components/form/Label';
import Input from '../../components/form/input/InputField';
import Button from '../../components/ui/button/Button';

interface SkillFormData {
  name: string;
  percentage: number | ''; 
}

export default function AddSkills() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const parentId = state?.parentId || '6856a9adba2983684f88c81a'; 

  const [formData, setFormData] = useState<SkillFormData>({
    name: '',
    percentage: '', 
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (!state?.parentId) {
      console.warn('parentId not provided; using fallback ID:', parentId);
    }
  }, [state, parentId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'name') {
      if (/^[a-zA-Z\s\-_]*$/.test(value)) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else if (name === 'percentage') {
      setFormData((prev) => ({
        ...prev,
        [name]: value === '' ? '' : Math.max(0, Math.min(100, Number(value))),
      }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError('Skill name is required');
      return;
    }
    if (formData.name.length > 50) {
      setError('Skill name must be 50 characters or less');
      return;
    }
    if (!/^[a-zA-Z\s\-_]+$/.test(formData.name)) {
      setError('Skill name can only contain letters, spaces, hyphens, or underscores');
      return;
    }
    if (formData.percentage === '') {
      setError('Percentage is required');
      return;
    }
    if (formData.percentage < 0 || formData.percentage > 100) {
      setError('Percentage must be between 0 and 100');
      return;
    }
    if (!Number.isInteger(Number(formData.percentage))) {
      setError('Percentage must be an integer');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await ngrokAxiosInstance.post(`/dynamic/ourSkills/${parentId}/skill`, {
        name: formData.name,
        percentage: Number(formData.percentage), 
       });
      alert('Skill added successfully!');
      navigate(-1); 
      window.history.replaceState(
        { ...location, refresh: true },
        '',
        location.pathname
      );
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add skill');
      console.error('Error adding skill:', err);
    } finally {
      setLoading(false);
    }
  };

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
            placeholder="Enter skill name (letters, spaces, hyphens, or underscores)"
            disabled={loading}
          />
        </div>
        <div>
          <Label htmlFor="percentage">Percentage (0-100)</Label>
          <Input
            type="number" 
            id="percentage"
            name="percentage"
            value={formData.percentage}
            onChange={handleInputChange}
            placeholder="Enter percentage (0-100)"
            min="0"
            max="100"
            step="1"
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