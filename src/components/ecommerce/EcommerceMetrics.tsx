import { useEffect, useState } from 'react';
import { GroupIcon, Loader2 } from 'lucide-react';
import ngrokAxiosInstance from '../../hooks/axiosInstance';
import { BoxIconLine } from '../../icons';
import ComponentCard from '../../components/common/ComponentCard';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';

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
        const response = await ngrokAxiosInstance.get('/auth/getAllCounts');
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

  // Map count types to icons
  const getIconForType = (type: string) => {
    switch (type) {
      case 'Team Count':
        return <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />;
      case 'Subscribe Count':
        return <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />;
      case 'ReachUs Count':
        return <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />; // Reuse GroupIconLine as placeholder
      case 'Contact Us Count':
        return <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />; // Reuse BoxIconLine as placeholder
      default:
        return <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />;
    }
  };

  // Show loader while fetching data
  if (loading) {
    return (
      <>
        <PageMeta
          title="React.js Metrics Dashboard | TailAdmin - Next.js Admin Dashboard Template"
          description="This is React.js Metrics Dashboard page for TailAdmin - MN techs Admin Dashboard"
        />
        <PageBreadcrumb pageTitle="Metrics" />
        <div className="space-y-6">
          <ComponentCard title="Ecommerce Metrics">
            <div className="flex justify-center items-center h-64">
              <Loader2 className="size-6 text-gray-500 animate-spin" />
              <span className="ml-2 text-gray-500">Loading...</span>
            </div>
          </ComponentCard>
        </div>
      </>
    );
  }

  // Show error if fetching fails
  if (error) {
    return (
      <>
        <PageMeta
          title="React.js Metrics Dashboard | TailAdmin - Next.js Admin Dashboard Template"
          description="This is React.js Metrics Dashboard page for TailAdmin - MN techs Admin Dashboard"
        />
        <PageBreadcrumb pageTitle="Metrics" />
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
      
     
      <div className="space-y-6">
      
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
            {counts.map((count, index) => (
              <div
                key={index}
                className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
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
              </div>
            ))}
          </div>
       
      </div>
    </>
  );
}