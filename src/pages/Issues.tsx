import { useEffect, useState } from 'react';
import { useIssueStore, categoryLabels, Issue } from '../store/issues';
import ARQRCodeModal from '../components/ARQRCodeModal';
import IssueDetailModal from '../components/IssueDetailModal';
import LikeButton from '../components/LikeButton';
import MonsterIcon from '../components/MonsterIcon';

export default function Issues() {
  const { issues, loading, error, fetchIssues } = useIssueStore();
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [likeCounts, setLikeCounts] = useState<{ [key: string]: number }>({});
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});

  // Fetch issues when component mounts
  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  // Update likes when issues change
  useEffect(() => {
    if (issues.length > 0) {
      fetchLikeCounts();
    }
  }, [issues]);

  useEffect(() => {
    // Log current issues state
    console.log('Issues state updated:', issues);
  }, [issues]);

  useEffect(() => {
    // Log all issues with their image URLs
    console.log('Current issues with images:', issues.map(issue => ({
      id: issue.id,
      original_image_url: issue.image_url
    })));
  }, [issues]);

  const fetchLikeCounts = async () => {
    try {
      // Initialize like counts to 0 for all issues
      const counts: { [key: string]: number } = {};
      issues.forEach((issue) => {
        counts[issue.id] = 0;
      });
      setLikeCounts(counts);
    } catch (error) {
      console.error('Error fetching like counts:', error);
    }
  };

  // Update the getImageUrl function
  const getImageUrl = (imageUrl: string | null | undefined): string | undefined => {
    if (!imageUrl) return undefined;
    return imageUrl;
  };

  // Add effect to handle image URLs
  useEffect(() => {
    const loadImageUrls = async () => {
      const urlMap: { [key: string]: string } = {};
      issues.forEach((issue) => {
        if (issue.image_url && typeof issue.image_url === 'string') {
          urlMap[issue.id] = issue.image_url;
        }
      });
      setImageUrls(urlMap);
    };

    loadImageUrls();
  }, [issues]);

  if (loading && issues.length === 0) {
    return (
      <div className="flex-1 bg-gray-50 p-4">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 bg-gray-50 p-4">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleCardClick = (issue: Issue) => {
    setSelectedIssue(issue);
    setIsDetailModalOpen(true);
  };

  const handleModalClose = () => {
    setIsDetailModalOpen(false);
    // Refresh like counts when modal is closed
    fetchLikeCounts();
  };

  const handleViewMonster = (issue: Issue, index: number) => {
    setSelectedIssue(issue);
    setSelectedIndex(index);
  };

  const handleLikeUpdate = (issueId: string, isLiked: boolean) => {
    setLikeCounts(prev => ({
      ...prev,
      [issueId]: (prev[issueId] || 0) + (isLiked ? 1 : -1)
    }));
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Community Reports</h1>
            <select
              className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              defaultValue="newest"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {issues.map((issue, index) => {
              const imageUrl = imageUrls[issue.id];
              
              return (
                <div
                  key={issue.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                  onClick={() => handleCardClick(issue)}
                >
                  {imageUrl ? (
                    <div className="relative w-full pt-[56.25%] bg-gray-100">
                      <img
                        src={imageUrl}
                        alt={`${issue.category} issue`}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Image failed to load:', {
                            original_url: issue.image_url,
                            processed_url: imageUrl
                          });
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/400x225?text=Image+Not+Available';
                        }}
                      />
                      <div className="absolute top-4 left-4 z-10">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-emerald-100/90 text-emerald-800 backdrop-blur-sm">
                          <MonsterIcon category={issue.category} size="small" className="mr-1" />
                          {categoryLabels[issue.category]}
                        </span>
                      </div>
                    </div>
                  ) : (
                    // Show a placeholder while loading or if image is not available
                    <div className="relative w-full pt-[56.25%] bg-gray-100">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-gray-400">No image available</span>
                      </div>
                    </div>
                  )}
                  <div className="p-6">
                    <p className="text-gray-900 text-lg mb-3 line-clamp-2">{issue.description}</p>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <span>📍</span>
                      <span>
                        {issue.latitude.toFixed(3)}°N, {issue.longitude.toFixed(3)}°E
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          issue.status === 'open' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : issue.status === 'in_progress'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {issue.status === 'open' ? 'Open' : issue.status === 'in_progress' ? 'In Progress' : 'Resolved'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(issue.created_at)}
                        </span>
                      </div>
                      <LikeButton
                        issueId={issue.id}
                        initialCount={likeCounts[issue.id] || 0}
                        onUpdate={(count) => {
                          setLikeCounts(prev => ({
                            ...prev,
                            [issue.id]: count
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selectedIssue && (
        <>
          <IssueDetailModal
            isOpen={isDetailModalOpen}
            onClose={handleModalClose}
            issue={selectedIssue}
            onLikeUpdate={handleLikeUpdate}
          />
          <ARQRCodeModal
            isOpen={selectedIndex !== -1}
            onClose={() => setSelectedIndex(-1)}
            issue={selectedIssue}
            issueIndex={selectedIndex}
          />
        </>
      )}
    </div>
  );
} 