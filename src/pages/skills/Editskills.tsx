import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import ngrokAxiosInstance from '../../hooks/axiosInstance';
import ComponentCard from '../../components/common/ComponentCard';
import Label from '../../components/form/Label';
import Input from '../../components/form/input/InputField';
import Button from '../../components/ui/button/Button';
import { Loader2 } from 'lucide-react';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';

// Define the Skill interface based on the API data structure
interface Skill {
  _id: string;
  name: string;
  percentage: number;
}

export default function EditSkills() {
  const { id } = useParams<{ id: string }>(); // Skill ID
  const navigate = useNavigate();
  const { state } = useLocation();
  const parentId = state?.parentId || '685a486732d957d421ab6cf9'; // Fallback to provided parent ID

  // State for form fields
  const [skill, setSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    percentage: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Warn if parentId is missing
  useEffect(() => {
    if (!state?.parentId) {
      console.warn('parentId not provided; using fallback ID:', parentId);
    }
  }, [state, parentId]);

  // Fetch skill data on component mount
  useEffect(() => {
    const fetchSkill = async () => {
      try {
        if (!id || !parentId) {
          throw new Error('Skill ID or Parent ID is missing');
        }
        console.log('Fetching skill with ID:', id, 'Parent ID:', parentId);
        const response = await ngrokAxiosInstance.get(`/dynamic/ourSkills/${parentId}/skill/${id}`);
        console.log('API Response:', response.data); // Debug response
        const skillData = response.data.data || response.data; // Adjust based on actual structure
        setSkill(skillData);
        setFormData({
          name: skillData.name || '',
          percentage: skillData.percentage || 0,
        });
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch skill data');
        console.error('Error fetching skill:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkill();
  }, [id, parentId]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'percentage' ? Math.max(0, Math.min(100, Number(value))) : value,
    }));
  };

  // Handle submit action
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Skill name is required');
      return;
    }
    if (formData.name.length > 100) {
      setError('Skill name must be 100 characters or less');
      return;
    }
    if (formData.percentage < 0 || formData.percentage > 100) {
      setError('Percentage must be between 0 and 100');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log('Updating skill with ID:', id, 'Parent ID:', parentId, 'Data:', formData);
      const response = await ngrokAxiosInstance.put(`/dynamic/ourSkills/${parentId}/skill/${id}`, formData);
      console.log('Update Response:', response.data);
      alert('Skill updated successfully!');
      navigate('/skills', { state: { refresh: true } });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update skill');
      console.error('Error updating skill:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    navigate('/skills');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="size-6 text-gray-500 animate-spin" />
        <span className="ml-2 text-gray-500">Loading...</span>
      </div>
    );
  }

  if (error || !skill) {
    return (
      <ComponentCard title="Edit Skill">
        <div className="text-red-500">{error || 'Skill not found'}</div>
      </ComponentCard>
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
              type="number"
              id="percentage"
              name="percentage"
              value={formData.percentage}
              onChange={handleInputChange}
              placeholder="Enter percentage"
              disabled={loading}
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
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
                'Save'
              )}
            </Button>
          </div>
        </form>
      </ComponentCard>
    </>
  );
}