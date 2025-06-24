import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import ngrokAxiosInstance from '../../hooks/axiosInstance';
import ComponentCard from '../../components/common/ComponentCard';
import Label from '../../components/form/Label';
import Input from '../../components/form/input/InputField';
import Button from '../../components/ui/button/Button';

interface Contact {
  _id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  agreeToUpdates: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function EditContact() {
  // Get contact ID from URL params
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State for form fields
  const [contact, setContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    agreeToUpdates: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch contact data on component mount
  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await ngrokAxiosInstance.get(`/contact/contact_us`);
        setContact(response.data);
        setFormData({
          name: response.data.name,
          phone: response.data.phone,
          email: response.data.email,
          message: response.data.message,
          agreeToUpdates: response.data.agreeToUpdates,
        });
      } catch (err) {
        setError('Failed to fetch contact data');
        console.error('Error fetching contact:', err);
      } finally {
        setLoading(false);
      }
    };
   
      fetchContact();
    
  }, []);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle checkbox change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, agreeToUpdates: e.target.checked }));
  };

  // Handle submit action
  const handleSubmit = async () => {
    try {
      await ngrokAxiosInstance.put(`/contact/contact_us/${id}`, {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        message: formData.message,
        agreeToUpdates: formData.agreeToUpdates,
      });
      alert('Contact updated successfully!');
      navigate(-1);
    } catch (err) {
      setError('Failed to update contact');
      console.error('Error updating contact:', err);
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !contact) {
    return <div>{error || 'Contact not found'}</div>;
  }

  return (
    <ComponentCard title="Edit Contact">
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
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Enter phone number"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter email"
          />
        </div>
        <div>
          <Label htmlFor="message">Message</Label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Enter message"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-dark-900 dark:border-gray-600 dark:text-gray-200"
            rows={4}
          />
        </div>
        <div className="flex items-center">
          <Label htmlFor="agreeToUpdates" className="mr-2">Agree to Updates</Label>
          <input
            type="checkbox"
            id="agreeToUpdates"
            name="agreeToUpdates"
            checked={formData.agreeToUpdates}
            onChange={handleCheckboxChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-dark-900 dark:border-gray-600"
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-200">Receive updates</span>
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