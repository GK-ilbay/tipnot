import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaUserCircle, FaPaperPlane, FaSpinner } from 'react-icons/fa';
import api from '../services/api';

const CommentSection = ({ contentId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch comments when component mounts or contentId changes
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/content/${contentId}/comments`);
        setComments(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError('Failed to load comments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (contentId) {
      fetchComments();
    }
  }, [contentId]);

  // Handle comment input change
  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  // Handle comment submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    setSubmitting(true);
    try {
      const response = await api.post(`/content/${contentId}/comments`, {
        text: newComment,
      });
      
      // Add the new comment to the list
      setComments([...comments, response.data]);
      
      // Clear the input field
      setNewComment('');
      setError(null);
    } catch (err) {
      console.error('Error posting comment:', err);
      setError('Failed to post your comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <CommentSectionContainer>
      <SectionTitle>Comments</SectionTitle>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {loading ? (
        <LoadingContainer>
          <FaSpinner className="spinner" />
          <p>Loading comments...</p>
        </LoadingContainer>
      ) : (
        <>
          {comments.length === 0 ? (
            <NoComments>No comments yet. Be the first to comment!</NoComments>
          ) : (
            <CommentsList>
              {comments.map((comment) => (
                <CommentItem key={comment._id}>
                  <CommentHeader>
                    <UserInfo>
                      <UserAvatar>
                        <FaUserCircle />
                      </UserAvatar>
                      <UserName>
                        {comment.userName || (comment.user?.name) || 'Anonymous User'}
                      </UserName>
                    </UserInfo>
                    <CommentDate>{formatDate(comment.createdAt)}</CommentDate>
                  </CommentHeader>
                  <CommentContent>{comment.text}</CommentContent>
                </CommentItem>
              ))}
            </CommentsList>
          )}
          
          <AddCommentForm onSubmit={handleSubmit}>
            <CommentInput
              placeholder="Add a comment..."
              value={newComment}
              onChange={handleCommentChange}
              disabled={submitting}
            />
            <SubmitButton type="submit" disabled={submitting || !newComment.trim()}>
              {submitting ? <FaSpinner className="spinner" /> : <FaPaperPlane />}
            </SubmitButton>
          </AddCommentForm>
        </>
      )}
    </CommentSectionContainer>
  );
};

const CommentSectionContainer = styled.section`
  margin-top: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const SectionTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  color: #2c3e50;
`;

const CommentsList = styled.div`
  margin-bottom: 2rem;
`;

const CommentItem = styled.div`
  margin-bottom: 1rem;
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const UserAvatar = styled.div`
  margin-right: 0.5rem;
`;

const UserName = styled.span`
  font-weight: bold;
`;

const CommentDate = styled.span`
  margin-left: 0.5rem;
  color: #95a5a6;
`;

const CommentContent = styled.p`
  margin: 0;
`;

const AddCommentForm = styled.form`
  display: flex;
  align-items: center;
`;

const CommentInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
`;

const SubmitButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  background-color: #3498db;
  color: #fff;
  border-radius: 4px;
  margin-left: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: #2980b9;
  }

  &:disabled {
    background-color: #d3d3d3;
    cursor: not-allowed;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
`;

const NoComments = styled.p`
  text-align: center;
  color: #95a5a6;
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  margin-bottom: 1rem;
`;

export default CommentSection;