import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import ngrokAxiosInstance from '../../hooks/axiosInstance';
import ComponentCard from '../../components/common/ComponentCard';
import Label from '../../components/form/Label';
import Input from '../../components/form/input/InputField';
import Button from '../../components/ui/button/Button';

// Define the Skill interface based on the API data structure
interface Skill {
  _id: string;
  name: string;
  percentage: number;
}

export default function EditSkills() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State for form fields
  const [skill, setSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    percentage: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Hardcoded parentId for now; ideally, fetch or pass dynamically
  const parentId = '6856a9adba2983684f88c81a'; // Replace with dynamic parentId if available

  // Fetch skill data on component mount
  useEffect(() => {
    const fetchSkill = async () => {
      try {
        const response = await ngrokAxiosInstance.get(`/dynamic/ourSkills/${parentId}/skill/${id}`);
        setSkill(response.data);
        setFormData({
          name: response.data.name || '',
          percentage: response.data.percentage || 0,
        });
      } catch (err) {
        setError('Failed to fetch skill data');
        console.error('Error fetching skill:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id && parentId) {
      fetchSkill();
    }
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
  const handleSubmit = async () => {
    try {
      await ngrokAxiosInstance.put(`/dynamic/ourSkills/${parentId}/skill/${id}`, {
        name: formData.name,
        percentage: formData.percentage,
      });
      alert('Skill updated successfully!');
      navigate(-1);
    } catch (err) {
      setError('Failed to update skill');
      console.error('Error updating skill:', err);
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !skill) {
    return <div>{error || 'Skill not found'}</div>;
  }

  return (
    <ComponentCard title="Edit Skill">
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
            min={0}
            max={100}
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
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
          >
            Submit
          </Button>
        </div>
      </div>
    </ComponentCard>
  );
}