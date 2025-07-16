import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import ngrokAxiosInstance from '../../hooks/axiosInstance';
import ComponentCard from '../../components/common/ComponentCard';
import Label from '../../components/form/Label';
import Input from '../../components/form/input/InputField';
import Button from '../../components/ui/button/Button';

export default function AddEmployee() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    linkedin_url: '',
    twitter_url: '',
    instagram_url: '',
    image: null as File | null,
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files) {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    const { name, designation, image } = formData;
    if (!name.trim() || !designation.trim()) {
      setError('Name and designation are required.');
      return;
    }
    if (!image) {
      setError('Please upload a profile image.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });

      await ngrokAxiosInstance.post('/dynamic/team', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Employee added successfully!');
      navigate(-1); 
      window.history.replaceState(
        { ...location, refresh: true },
        '',
        location.pathname
      );
    } catch (err: any) {
      console.error('Error adding employee:', err);
      setError(err.response?.data?.message || 'Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <ComponentCard title="Add Employee">
      <div className="space-y-6">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter name"
            disabled={loading}
          />
        </div>

        <div>
          <Label htmlFor="designation">Designation</Label>
          <Input
            type="text"
            id="designation"
            name="designation"
            value={formData.designation}
            onChange={handleInputChange}
            placeholder="Enter designation"
            disabled={loading}
          />
        </div>

        <div>
          <Label htmlFor="image">Profile Image</Label>
          <Input
            type="file"
            id="image"
            name="image"
            onChange={handleInputChange}
            accept="image/*"
            disabled={loading}
          />
        </div>

        <div>
          <Label htmlFor="linkedin_url">LinkedIn URL</Label>
          <Input
            type="text"
            id="linkedin_url"
            name="linkedin_url"
            value={formData.linkedin_url}
            onChange={handleInputChange}
            placeholder="https://linkedin.com/in/..."
            disabled={loading}
          />
        </div>

        <div>
          <Label htmlFor="twitter_url">Twitter URL</Label>
          <Input
            type="text"
            id="twitter_url"
            name="twitter_url"
            value={formData.twitter_url}
            onChange={handleInputChange}
            placeholder="https://twitter.com/..."
            disabled={loading}
          />
        </div>

        <div>
          <Label htmlFor="instagram_url">Instagram URL</Label>
          <Input
            type="text"
            id="instagram_url"
            name="instagram_url"
            value={formData.instagram_url}
            onChange={handleInputChange}
            placeholder="https://instagram.com/..."
            disabled={loading}
          />
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

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
