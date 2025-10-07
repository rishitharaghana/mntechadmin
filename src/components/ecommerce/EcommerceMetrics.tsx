import { useEffect, useState } from 'react';
import { Link } from 'react-router'; // Correct import for Link
import { Loader2, Users, Package, Mail, Phone } from 'lucide-react';
import ngrokAxiosInstance from '../../hooks/axiosInstance';
import ComponentCard from '../../components/common/ComponentCard';
import PageMeta from '../../components/common/PageMeta';

  const user = localStorage.getItem("user");
  const userData = user ? JSON.parse(user) : null;

// Define the interface for the count data
interface Count {
  type: string;
  count: number;
}

export default function EcommerceMetrics() {
  const [counts, setCounts] = useState<Count[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from the API
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);
        const response = await ngrokAxiosInstance.get('/auth/getall_counts');
        setCounts(response.data.data);
      } catch (err) {
        console.error('Error fetching counts:', err);
        setError('Failed to fetch counts');
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  // Map count types to icons from lucide-react
  const getIconForType = (type: string) => {
    switch (type) {
      case 'Team Count':
        return <Users className="text-gray-800 size-6 dark:text-white/90" />;
      case 'Subscribe Count':
        return <Package className="text-gray-800 size-6 dark:text-white/90" />;
      case 'ReachUs Count':
        return <Mail className="text-gray-800 size-6 dark:text-white/90" />;
      case 'Contact Us Count':
        return <Phone className="text-gray-800 size-6 dark:text-white/90" />;
      default:
        return <Users className="text-gray-800 size-6 dark:text-white/90" />;
    }
  };

  const getRouteForType = (type: string) => {
    switch (type) {
      case 'Team Count':
        return '/employees';
      case 'Subscribe Count':
        return '/newLetter/all';
      case 'ReachUs Count':
        return '/reachus';
      case 'Contact Us Count':
        return '/contact/contact_us';
      default:
        return '#';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="size-6 text-gray-500 animate-spin" />
        <span className="ml-2 text-gray-500">Loading...</span>
      </div>
    );
  }

  // Show error if fetching fails
  if (error) {
    return (
      <>
        <PageMeta
          title="MnTechs Solutions Pvt Ltd"
          description="This is MN techs Admin Dashboard"
        />
        <div className="space-y-6">
          <ComponentCard title="Ecommerce Metrics">
            <div className="text-red-500 text-center">{error}</div>
          </ComponentCard>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title="MnTechs Solutions Pvt Ltd"
        description="This is MN techs Admin Dashboard"
      />
      <div className="w-max space-y-6 p-4">
        <h1 className="text-2xl font-bold text-[#1b7fba] mb-3">Welcome Back, {userData ? userData.name : "Guest User"}!</h1>
        <p className="text-gray-600 text-sm mb-8">Here's a slightly detailed overview of your team performance and key metrics for the admin panel.</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
          {counts.map((count, index) => (
            <Link
              key={index}
              to={getRouteForType(count.type)}
              className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                {getIconForType(count.type)}
              </div>
              <div className="flex items-end justify-between mt-5">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {count.type}
                  </span>
                  <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                    {count.count.toLocaleString()}
                  </h4>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}