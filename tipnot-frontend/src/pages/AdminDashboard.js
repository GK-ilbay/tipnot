import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { FaUser, FaCommentAlt, FaEdit, FaTrash, FaCheck, FaBan } from 'react-icons/fa';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Check if user is admin, redirect if not
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/');
    }
  }, [currentUser, navigate]);
  
  // Fetch users and comments data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      
      try {
        if (activeTab === 'users') {
          const response = await api.get('/admin/users');
          setUsers(response.data);
        } else if (activeTab === 'comments') {
          const response = await api.get('/admin/comments');
          setComments(response.data);
        }
      } catch (err) {
        setError('Failed to load data. Please try again.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [activeTab]);
  
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        setUsers(users.filter(user => user._id !== userId));
      } catch (err) {
        setError('Failed to delete user. Please try again.');
      }
    }
  };
  
  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ));
    } catch (err) {
      setError('Failed to update user role. Please try again.');
    }
  };
  
  const handleModerateComment = async (commentId, action) => {
    try {
      await api.put(`/admin/comments/${commentId}`, { status: action });
      setComments(comments.map(comment => 
        comment._id === commentId ? { ...comment, status: action } : comment
      ));
    } catch (err) {
      setError('Failed to moderate comment. Please try again.');
    }
  };
  
  const renderUsers = () => {
    if (loading) return <LoadingMessage>Loading users...</LoadingMessage>;
    if (error) return <ErrorMessage>{error}</ErrorMessage>;
    if (users.length === 0) return <EmptyMessage>No users found.</EmptyMessage>;
    
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Username</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>Role</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user._id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <ActionButtons>
                    {user.role === 'user' ? (
                      <ActionButton 
                        title="Make Admin"
                        onClick={() => handleUpdateUserRole(user._id, 'admin')}
                      >
                        <FaEdit />
                      </ActionButton>
                    ) : (
                      <ActionButton 
                        title="Make User"
                        onClick={() => handleUpdateUserRole(user._id, 'user')}
                      >
                        <FaUser />
                      </ActionButton>
                    )}
                    <ActionButton 
                      title="Delete User"
                      onClick={() => handleDeleteUser(user._id)}
                      $danger
                    >
                      <FaTrash />
                    </ActionButton>
                  </ActionButtons>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };
  
  const renderComments = () => {
    if (loading) return <LoadingMessage>Loading comments...</LoadingMessage>;
    if (error) return <ErrorMessage>{error}</ErrorMessage>;
    if (comments.length === 0) return <EmptyMessage>No comments found.</EmptyMessage>;
    
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>User</TableHeader>
              <TableHeader>Content</TableHeader>
              <TableHeader>Comment</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {comments.map(comment => (
              <TableRow key={comment._id}>
                <TableCell>{comment.user?.username || 'Deleted User'}</TableCell>
                <TableCell>{comment.content?.title || 'Deleted Content'}</TableCell>
                <TableCell className="comment-text">{comment.text}</TableCell>
                <TableCell>
                  <StatusBadge status={comment.status}>
                    {comment.status}
                  </StatusBadge>
                </TableCell>
                <TableCell>
                  <ActionButtons>
                    <ActionButton 
                      title="Approve"
                      onClick={() => handleModerateComment(comment._id, 'approved')}
                    >
                      <FaCheck />
                    </ActionButton>
                    <ActionButton 
                      title="Reject"
                      onClick={() => handleModerateComment(comment._id, 'rejected')}
                      $danger
                    >
                      <FaBan />
                    </ActionButton>
                  </ActionButtons>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };
  
  return (
    <DashboardContainer>
      <DashboardHeader>
        <h1>Admin Dashboard</h1>
        <p>Manage users and content</p>
      </DashboardHeader>
      
      <TabsContainer>
        <Tab 
          $active={activeTab === 'users'} 
          onClick={() => setActiveTab('users')}
        >
          <FaUser /> Users
        </Tab>
        <Tab 
          $active={activeTab === 'comments'} 
          onClick={() => setActiveTab('comments')}
        >
          <FaCommentAlt /> Comments
        </Tab>
      </TabsContainer>
      
      <TabContent>
        {activeTab === 'users' ? renderUsers() : renderComments()}
      </TabContent>
    </DashboardContainer>
  );
};

// Styled Components
const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const DashboardHeader = styled.div`
  margin-bottom: 2rem;
  text-align: center;
  
  h1 {
    color: #2c3e50;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #7f8c8d;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 2rem;
`;

const Tab = styled.div`
  padding: 1rem 2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.$active ? '#3498db' : '#34495e'};
  border-bottom: ${props => props.$active ? '2px solid #3498db' : 'none'};
  
  &:hover {
    background-color: #f8f9fa;
  }
  
  svg {
    font-size: 1.1rem;
  }
`;

const TabContent = styled.div`
  min-height: 300px;
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  .comment-text {
    max-width: 300px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const TableHead = styled.thead`
  background-color: #f8f9fa;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8f9fa;
  }
  
  &:hover {
    background-color: #f1f3f5;
  }
`;

const TableHeader = styled.th`
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #ddd;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 4px;
  background-color: ${props => props.$danger ? '#e74c3c' : '#3498db'};
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: ${props => props.$danger ? '#c0392b' : '#2980b9'};
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
  
  ${props => {
    switch(props.status) {
      case 'approved':
        return `
          background-color: #d4edda;
          color: #155724;
        `;
      case 'rejected':
        return `
          background-color: #f8d7da;
          color: #721c24;
        `;
      case 'pending':
      default:
        return `
          background-color: #fff3cd;
          color: #856404;
        `;
    }
  }}
`;

const LoadingMessage = styled.div`
  padding: 2rem;
  text-align: center;
  color: #7f8c8d;
  font-style: italic;
`;

const ErrorMessage = styled.div`
  padding: 1rem;
  margin: 1rem 0;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
`;

const EmptyMessage = styled.div`
  padding: 2rem;
  text-align: center;
  color: #7f8c8d;
`;

export default AdminDashboard; 