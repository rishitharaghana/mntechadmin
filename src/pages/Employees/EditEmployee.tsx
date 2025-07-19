import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import ngrokAxiosInstance from '../../hooks/axiosInstance';
import ComponentCard from '../../components/common/ComponentCard';
import Label from '../../components/form/Label';
import Input from '../../components/form/input/InputField';
import Button from '../../components/ui/button/Button';
import { AxiosError } from 'axios';

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

  const [errors, setErrors] = useState({
    name: '',
    designation: '',
    linkedin_url: '',
    twitter_url: '',
    instagram_url: '',
    image: '',
    general: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await ngrokAxiosInstance.get(`/dynamic/team/${id}`);
        const data = response.data;

        setFormData({
          name: data.name,
          designation: data.designation,
          linkedin_url: data.linkedin_url || '',
          twitter_url: data.twitter_url || '',
          instagram_url: data.instagram_url || '',
          image: data.image || null,
        });
      } catch (err) {
        setErrors((prev) => ({ ...prev, general: 'Failed to load employee' }));
        console.error('Fetch error:', err);
      }
    };

    if (id) fetchEmployee();
  }, [id]);

  // Validation functions
  const validateName = (name: string) => {
    if (!name.trim()) return 'Name is required';
    if (name.length < 2) return 'Name must be at least 2 characters';
    if (name.length > 50) return 'Name cannot exceed 50 characters';
    if (!/^[a-zA-Z\s]*$/.test(name)) return 'Name can only contain letters and spaces';
    return '';
  };

  const validateDesignation = (designation: string) => {
    if (!designation.trim()) return 'Designation is required';
    if (designation.length < 2) return 'Designation must be at least 2 characters';
    if (designation.length > 100) return 'Designation cannot exceed 100 characters';
    return '';
  };

  const validateUrl = (url: string, platform: string) => {
    if (!url) return ''; // URLs are optional
    try {
      new URL(url);
      if (platform === 'linkedin' && !url.includes('linkedin.com')) {
        return 'Please enter a valid LinkedIn URL';
      }
      if (platform === 'twitter' && !url.includes('twitter.com') && !url.includes('x.com')) {
        return 'Please enter a valid Twitter URL';
      }
      if (platform === 'instagram' && !url.includes('instagram.com')) {
        return 'Please enter a valid Instagram URL';
      }
      return '';
    } catch {
      return `Please enter a valid ${platform} URL`;
    }
  };

  const validateImage = (image: File | string | null) => {
    if (!image) return 'Profile image is required';
    if (image instanceof File) {
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(image.type)) {
        return 'Only JPEG, PNG, or GIF images are allowed';
      }
      if (image.size > 5 * 1024 * 1024) {
        // 5MB limit
        return 'Image size cannot exceed 5MB';
      }
    }
    return '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === 'image' && files) {
      setFormData((prev) => ({ ...prev, image: files[0] }));
      setErrors((prev) => ({ ...prev, image: validateImage(files[0]) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Validate based on input name
      switch (name) {
        case 'name':
          setErrors((prev) => ({ ...prev, name: validateName(value) }));
          break;
        case 'designation':
          setErrors((prev) => ({ ...prev, designation: validateDesignation(value) }));
          break;
        case 'linkedin_url':
          setErrors((prev) => ({ ...prev, linkedin_url: validateUrl(value, 'linkedin') }));
          break;
        case 'twitter_url':
          setErrors((prev) => ({ ...prev, twitter_url: validateUrl(value, 'twitter') }));
          break;
        case 'instagram_url':
          setErrors((prev) => ({ ...prev, instagram_url: validateUrl(value, 'instagram') }));
          break;
      }
    }
  };

  const handleSubmit = async () => {
    // Validate all fields before submission
    const nameError = validateName(formData.name);
    const designationError = validateDesignation(formData.designation);
    const linkedinError = validateUrl(formData.linkedin_url, 'linkedin');
    const twitterError = validateUrl(formData.twitter_url, 'twitter');
    const instagramError = validateUrl(formData.instagram_url, 'instagram');
    const imageError = validateImage(formData.image);

    setErrors({
      name: nameError,
      designation: designationError,
      linkedin_url: linkedinError,
      twitter_url: twitterError,
      instagram_url: instagramError,
      image: imageError,
      general: '',
    });

    if (nameError || designationError || imageError || linkedinError || twitterError || instagramError) {
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('designation', formData.designation);
      data.append('linkedin_url', formData.linkedin_url);
      data.append('twitter_url', formData.twitter_url);
      data.append('instagram_url', formData.instagram_url);

      if (formData.image instanceof File) {
        data.append('image', formData.image);
      }

      await ngrokAxiosInstance.put(`/dynamic/team/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Employee updated successfully!');
      navigate('/employees', { state: { refresh: true } });
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      console.error('Update error:', err.response?.data?.message || err.message);
      setErrors((prev) => ({
        ...prev,
        general: err.response?.data?.message || 'Failed to update employee',
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate(-1);

  return (
    <ComponentCard title="Edit Employee">
      <div className="space-y-6">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter name"
            disabled={loading}
            required
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
        </div>

        <div>
          <Label htmlFor="designation">Designation *</Label>
          <Input
            type="text"
            id="designation"
            name="designation"
            value={formData.designation}
            onChange={handleInputChange}
            placeholder="Enter designation"
            disabled={loading}
            required
            className={errors.designation ? 'border-red-500' : ''}
          />
          {errors.designation && <div className="text-red-500 text-sm mt-1">{errors.designation}</div>}
        </div>

        <div>
          <Label htmlFor="image">Profile Image *</Label>
          <Input
            type="file"
            id="image"
            name="image"
            accept="image/jpeg,image/png,image/gif"
            onChange={handleInputChange}
            disabled={loading}
            className={errors.image ? 'border-red-500' : ''}
          />
          {formData.image && typeof formData.image === 'string' && (
            <div className="mt-2 text-sm text-gray-600">Current image: {formData.image}</div>
          )}
          {errors.image && <div className="text-red-500 text-sm mt-1">{errors.image}</div>}
        </div>

        <div>
          <Label htmlFor="linkedin_url">LinkedIn URL</Label>
          <Input
            type="url"
            id="linkedin_url"
            name="linkedin_url"
            value={formData.linkedin_url}
            onChange={handleInputChange}
            placeholder="https://linkedin.com/in/..."
            disabled={loading}
            className={errors.linkedin_url ? 'border-red-500' : ''}
          />
          {errors.linkedin_url && <div className="text-red-500 text-sm mt-1">{errors.linkedin_url}</div>}
        </div>

        <div>
          <Label htmlFor="twitter_url">Twitter URL</Label>
          <Input
            type="url"
            id="twitter_url"
            name="twitter_url"
            value={formData.twitter_url}
            onChange={handleInputChange}
            placeholder="https://twitter.com/..."
            disabled={loading}
            className={errors.twitter_url ? 'border-red-500' : ''}
          />
          {errors.twitter_url && <div className="text-red-500 text-sm mt-1">{errors.twitter_url}</div>}
        </div>

        <div>
          <Label htmlFor="instagram_url">Instagram URL</Label>
          <Input
            type="url"
            id="instagram_url"
            name="instagram_url"
            value={formData.instagram_url}
            onChange={handleInputChange}
            placeholder="https://instagram.com/..."
            disabled={loading}
            className={errors.instagram_url ? 'border-red-500' : ''}
          />
          {errors.instagram_url && <div className="text-red-500 text-sm mt-1">{errors.instagram_url}</div>}
        </div>

        {errors.general && <div className="text-red-500 text-sm">{errors.general}</div>}

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