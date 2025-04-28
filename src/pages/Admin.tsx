import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../lib/services/auth';
import { useIssueStore } from '../store/issues';
import toast from 'react-hot-toast';

export function Admin() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { issues, fetchIssues, updateIssueStatus } = useIssueStore();
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    if (!user?.role || user.role !== 'admin') {
      navigate('/');
      return;
    }

    fetchIssues().finally(() => setLoading(false));
  }, [user, navigate, fetchIssues]);

  const handleStatusUpdate = async (issueId: string, newStatus: 'open' | 'in_progress' | 'resolved') => {
    try {
      await updateIssueStatus(issueId, newStatus);
      toast.success('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const filteredIssues = selectedStatus === 'all' 
    ? issues 
    : issues.filter(issue => issue.status === selectedStatus);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-100 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Total Issues</h3>
            <p className="text-3xl font-bold text-blue-600">{issues.length}</p>
          </div>
          <div className="bg-yellow-100 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Open Issues</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {issues.filter(i => i.status === 'open').length}
            </p>
          </div>
          <div className="bg-purple-100 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">In Progress</h3>
            <p className="text-3xl font-bold text-purple-600">
              {issues.filter(i => i.status === 'in_progress').length}
            </p>
          </div>
          <div className="bg-green-100 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Resolved</h3>
            <p className="text-3xl font-bold text-green-600">
              {issues.filter(i => i.status === 'resolved').length}
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Issues Management</h2>
          <div className="flex justify-between items-center mb-4">
            <div className="w-64">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredIssues.map((issue) => (
                <tr key={issue.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{issue.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {issue.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      issue.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                      issue.status === 'in_progress' ? 'bg-purple-100 text-purple-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {issue.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(issue.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={issue.status}
                      onChange={(e) => handleStatusUpdate(issue.id, e.target.value as 'open' | 'in_progress' | 'resolved')}
                      className="p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 