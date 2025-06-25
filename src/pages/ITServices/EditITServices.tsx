import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import ngrokAxiosInstance from '../../hooks/axiosInstance';
import ComponentCard from '../../components/common/ComponentCard';
import Label from '../../components/form/Label';
import Input from '../../components/form/input/InputField';
import Button from '../../components/ui/button/Button';

interface Item {
  _id: string;
  title: string;
  description: string;
  icon: string;
}

export default function EditITServices() {
  const { id, type } = useParams<{ id: string; type: 'service' | 'product' }>();
  const navigate = useNavigate();
  const { state } = useLocation();
  const parentId = state?.parentId;

  const [item, setItem] = useState<Item | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const apiType = type === 'service' ? 'itServices' : 'products';

  useEffect(() => {
    if (!parentId || !id || !apiType) {
      setError('Missing required identifiers');
      setLoading(false);
      return;
    }

    const fetchItem = async () => {
      try {
        const endpoint = `/dynamic/serviceSection/${parentId}/${apiType}/${id}`;
        const response = await ngrokAxiosInstance.get(endpoint);
        const data = response.data;
        setItem(data);
        setFormData({
          title: data.title || '',
          description: data.description || '',
          icon: data.icon || '',
        });
      } catch (err) {
        setError('Failed to fetch item');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id, apiType, parentId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!parentId || !id || !apiType) {
      setError('Invalid input');
      return;
    }

    try {
      const endpoint = `/dynamic/serviceSection/${parentId}/${apiType}/${id}`;
      await ngrokAxiosInstance.put(endpoint, formData);
      alert('Item updated successfully!');
      navigate(-1);
    } catch (err) {
      setError('Failed to update item');
      console.error('Update error:', err);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) return <div className="text-gray-500">Loading...</div>;
  if (error || !item) return <div className="text-red-500">{error || 'Item not found'}</div>;

  return (
    <ComponentCard title={`Edit ${type === 'service' ? 'IT Service' : 'Product'}`}>
      <div className="space-y-6">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter title"
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter description"
            rows={5}
            className="w-full px-3 py-2 border rounded-md dark:bg-dark-900"
          />
        </div>
        <div>
          <Label htmlFor="icon">Icon</Label>
          <Input
            type="text"
            id="icon"
            name="icon"
            value={formData.icon}
            onChange={handleInputChange}
            placeholder="Enter icon name"
          />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <div className="flex gap-4">
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>Submit</Button>
        </div>
      </div>
    </ComponentCard>
  );
}
