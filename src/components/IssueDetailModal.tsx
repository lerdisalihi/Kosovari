import React, { useState, useEffect } from 'react';
import { Issue } from '../store/issues';
import MonsterIcon from './MonsterIcon';

interface Comment {
  id: string;
  issue_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user_email?: string;
}

interface IssueDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  issue: Issue | null;
  onLikeUpdate?: (issueId: string, isLiked: boolean) => void;
}

const IssueDetailModal: React.FC<IssueDetailModalProps> = ({ isOpen, onClose, issue, onLikeUpdate }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Add a mock user for demo purposes
  const mockUser = { id: '1', email: 'demo@example.com' };

  useEffect(() => {
    if (isOpen && issue) {
      fetchComments();
      fetchLikes();
    }
  }, [isOpen, issue]);

  const fetchComments = async () => {
    if (!issue) return;
    
    try {
      // Fetch comments
      const commentsData = comments;

      // Combine comments with user emails
      const formattedComments = commentsData.map(comment => ({
        id: comment.id,
        issue_id: comment.issue_id,
        user_id: comment.user_id,
        content: comment.content,
        created_at: comment.created_at,
        user_email: 'Anonymous'
      }));

      console.log('Fetched comments:', formattedComments);
      setComments(formattedComments);
      setError(null);
    } catch (error) {
      console.error('Error in fetchComments:', error);
      setError('Failed to load comments');
    }
  };

  const fetchLikes = async () => {
    if (!issue) return;

    try {
      // Get like count
      setLikeCount(comments.length);

      // Only check user's like status if they're logged in
      if (mockUser) {
        setIsLiked(comments.some(comment => comment.user_id === mockUser.id));
      }
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };

  const handleLike = async () => {
    if (!mockUser || !issue) return;

    try {
      setIsLoading(true);
      if (isLiked) {
        // Unlike
        const newComments = comments.filter(comment => comment.user_id !== mockUser.id);
        setComments(newComments);
      } else {
        // Like
        const newComment: Comment = {
          id: (Math.random() * 1000000).toString(),
          issue_id: issue.id,
          user_id: mockUser.id,
          content: '',
          created_at: new Date().toISOString()
        };
        setComments(prevComments => [...prevComments, newComment]);
      }
      setIsLiked(!isLiked);
      
      // Trigger a refresh of the parent component's like counts
      if (onLikeUpdate) {
        onLikeUpdate(issue.id, !isLiked);
      }
      
      // Also fetch the latest like count to ensure accuracy
      fetchLikes();
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mockUser || !issue || !newComment.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // First, create the comment
      const newCommentData: Comment = {
        id: (Math.random() * 1000000).toString(),
        issue_id: issue.id,
        user_id: mockUser.id,
        content: newComment.trim(),
        created_at: new Date().toISOString()
      };

      setComments(prevComments => [...prevComments, newCommentData]);
      setNewComment('');
      console.log('Successfully added comment:', newCommentData);
    } catch (error) {
      console.error('Error in handleSubmitComment:', error);
      setError('Failed to post comment');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !issue) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <MonsterIcon category={issue.category} size="small" className="mr-2" />
                {issue.category.charAt(0).toUpperCase() + issue.category.slice(1)} Issue
              </h3>
              <p className="text-sm text-gray-500">
                Reported on {new Date(issue.created_at).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{issue.description}</p>
            </div>

            {issue.image_url && (
              <div className="rounded-lg overflow-hidden">
                <img
                  src={typeof issue.image_url === 'string' ? issue.image_url : undefined}
                  alt="Issue"
                  className="w-full h-64 object-cover"
                />
              </div>
            )}

            <div className="flex items-center gap-4 py-2 border-y">
              <button
                onClick={handleLike}
                disabled={!mockUser}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                  isLiked
                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } ${!mockUser && 'opacity-50 cursor-not-allowed'}`}
              >
                <span>{isLiked ? '❤️' : '🤍'}</span>
                <span>{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
              </button>
              {!mockUser && (
                <span className="text-sm text-gray-500">
                  Log in to like this issue
                </span>
              )}
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <span>Comments</span>
                <span className="text-sm text-gray-500">({comments.length})</span>
              </h4>

              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
                  {error}
                </div>
              )}

              {mockUser ? (
                <form onSubmit={handleSubmitComment} className="mb-6">
                  <div className="flex flex-col space-y-2">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      rows={3}
                      disabled={isLoading}
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isLoading || !newComment.trim()}
                        className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors
                          ${(isLoading || !newComment.trim()) ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isLoading ? 'Posting...' : 'Post Comment'}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center text-gray-600">
                  Please log in to post comments
                </div>
              )}

              <div className="space-y-4">
                {comments.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No comments yet. Be the first to comment!
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {(comment.user_email || 'A')[0].toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex-grow">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-900">
                              {comment.user_email || 'Anonymous'}
                            </span>
                            <span className="text-sm text-gray-500">
                              {new Date(comment.created_at).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-gray-700 whitespace-pre-wrap">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {comments.length >= 10 && (
                <div className="text-center mt-4">
                  <button
                    onClick={fetchComments}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Load More Comments
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetailModal; 