import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import ngrokAxiosInstance from '../../hooks/axiosInstance';
import ComponentCard from '../../components/common/ComponentCard';
import Label from '../../components/form/Label';
import Input from '../../components/form/input/InputField';
import Button from '../../components/ui/button/Button';

// Define the Service interface based on the API data structure
interface Service {
  _id: string;
  title: string;
  description: string;
}

export default function EditService() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State for form fields
  const [service, setService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch service data on component mount
  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await ngrokAxiosInstance.get(`/dynamic/service/${id}`);
        setService(response.data);
        setFormData({
          title: response.data.title || '',
          description: response.data.description || '',
        });
      } catch (err) {
        setError('Failed to fetch service data');
        console.error('Error fetching service:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchService();
    }
  }, [id]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle submit action
  const handleSubmit = async () => {
    try {
      await ngrokAxiosInstance.put(`/dynamic/service/${id}`, {
        title: formData.title,
        description: formData.description,
      });
      alert('Service updated successfully!');
      navigate(-1);
    } catch (err) {
      setError('Failed to update service');
      console.error('Error updating service:', err);
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !service) {
    return <div>{error || 'Service not found'}</div>;
  }

  return (
    <ComponentCard title="Edit Service">
      <div className="space-y-6">
        <div>
          <Label htmlFor="title">Service Title</Label>
          <Input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter service title"
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter service description"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-dark-900 dark:border-gray-600 dark:text-gray-200"
            rows={5}
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