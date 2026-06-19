import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Review() {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const submitReview = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('splashx_token');

      await axios.post(
        '/api/reviews',
        {
          rating,
          comment
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success('Review submitted successfully!');
      setComment('');
      setRating(5);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  return (
    <div className="container" style={{ padding: '40px' }}>
      <h1>Write a Review</h1>

      <form onSubmit={submitReview}>
        <label>Rating</label>

        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          <option value="5">★★★★★ (5)</option>
          <option value="4">★★★★☆ (4)</option>
          <option value="3">★★★☆☆ (3)</option>
          <option value="2">★★☆☆☆ (2)</option>
          <option value="1">★☆☆☆☆ (1)</option>
        </select>

        <br /><br />

        <textarea
          rows="5"
          placeholder="Tell us about your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={{ width: '100%' }}
        />

        <br /><br />

        <button type="submit">
          Submit Review
        </button>
      </form>
    </div>
  );
}