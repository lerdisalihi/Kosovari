import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface LikeButtonProps {
  issueId: string;
  initialCount?: number;
  onUpdate?: (count: number) => void;
}

const LikeButton: React.FC<LikeButtonProps> = ({ issueId, initialCount = 0, onUpdate }) => {
  const [likeCount, setLikeCount] = useState(initialCount);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchLikeCount();
  }, []);

  // Add a separate effect to update the like count when initialCount changes
  useEffect(() => {
    setLikeCount(initialCount);
  }, [initialCount]);

  const fetchLikeCount = async () => {
    try {
      setLikeCount(likeCount);
      onUpdate?.(likeCount);
    } catch (error) {
      console.error('Error in fetchLikeCount:', error);
    }
  };

  const handleLike = async () => {
    setIsLoading(true);
    try {
      if (isLiked) {
        // Unlike
        setIsLiked(false);
      } else {
        // Like
        setIsLiked(true);
      }

      await fetchLikeCount();
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
        isLiked
          ? 'bg-red-100 text-red-600 hover:bg-red-200'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span>{isLiked ? '❤️' : '🤍'}</span>
      <span>{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
    </button>
  );
};

export default LikeButton; 