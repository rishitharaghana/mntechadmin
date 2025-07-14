import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import ngrokAxiosInstance from '../../hooks/axiosInstance';
import ComponentCard from '../../components/common/ComponentCard';
import Label from '../../components/form/Label';
import Input from '../../components/form/input/InputField';
import Button from '../../components/ui/button/Button';

export default function EditEmployee() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    linkedin_url: '',
    twitter_url: '',
    instagram_url: '',
    image: null as File | string | null, 
  });

  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await ngrokAxiosInstance.get(`/dynamic/team/${id}`);
        const data = response.data;

        setFormData({
          name: data.name,
          designation: data.designation,
          linkedin_url: data.linkedin_url,
          twitter_url: data.twitter_url,
          instagram_url: data.instagram_url,
          image: data.image,
        });

        setExistingImage(data.image);
      } catch (err) {
        setError('Failed to load employee');
        console.error('Fetch error:', err);
      }
    };

    if (id) fetchEmployee();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  setError(null);
  setLoading(true);

  try {
    const data = new FormData();

    data.append('name', name);
    data.append('designation', designation);
    data.append('linkedin_url', formData.linkedin_url);
    data.append('twitter_url', formData.twitter_url);
    data.append('instagram_url', formData.instagram_url);

    if (image instanceof File) {
      data.append('image', image);
    }

    await ngrokAxiosInstance.put(`/dynamic/team/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    alert('Employee updated successfully!');
    navigate(-1, { state: { refresh: true } });
  } catch (err: any) {
    console.error('Update error:', err);
    setError(err.response?.data?.message || 'Failed to update employee');
  } finally {
    setLoading(false);
  }
};


  const handleCancel = () => navigate(-1);

  return (
    <ComponentCard title="Edit Employee">
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
            accept="image/*"
            onChange={handleInputChange}
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
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </div>
      </div>
    </ComponentCard>
  );
}
