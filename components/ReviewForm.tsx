'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { showToast } from './Toast';

interface ReviewFormProps {
  productId: string;
  onSubmit?: (review: { rating: number; title: string; comment: string }) => void;
}

export default function ReviewForm({ productId, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      showToast('Please select a rating', 'warning');
      return;
    }

    if (!comment.trim()) {
      showToast('Please write a review', 'warning');
      return;
    }

    setSubmitting(true);

    // Mock API call
    setTimeout(() => {
      const review = {
        rating,
        title: title.trim() || 'No title',
        comment: comment.trim(),
      };

      if (onSubmit) {
        onSubmit(review);
      }

      showToast('Review submitted successfully!', 'success');
      
      // Reset form
      setRating(0);
      setTitle('');
      setComment('');
      setSubmitting(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="font-bold text-lg mb-3">Write a Review</h3>
        <p className="text-sm text-gray-600 mb-4">
          Share your thoughts with other customers
        </p>
      </div>

      {/* Rating */}
      <div>
        <label className="block font-medium mb-2">Rating *</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 ${
                  star <= (hoverRating || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-sm text-gray-600 self-center">
              {rating} star{rating > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block font-medium mb-2">Review Title (Optional)</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your experience"
          maxLength={100}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* Comment */}
      <div>
        <label className="block font-medium mb-2">Review *</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tell us what you think about this product..."
          rows={5}
          required
          maxLength={500}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
        />
        <div className="text-right text-sm text-gray-500 mt-1">
          {comment.length}/500 characters
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
