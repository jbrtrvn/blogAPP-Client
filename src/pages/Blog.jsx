import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import AuthContext from '../AuthContext';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const Blog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { isLoggedIn, user } = useContext(AuthContext);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/posts/${id}`)
      .then(response => response.json())
      .then(data => {
        if (data.title && data.content) {
          setBlog(data);
          setTitle(data.title);
          setContent(data.content);
        } else {
          Swal.fire('Error', 'Blog not found', 'error');
        }
      })
      .catch(error => Swal.fire('Error', 'Error fetching blog', 'error'));

    fetch(`${import.meta.env.VITE_API_URL}/posts/${id}/comments`)
      .then(response => response.json())
      .then(data => setComments(data.comments || []))
      .catch(error => Swal.fire('Error', 'Error fetching comments', 'error'));
  }, [id]);

  const handleAddComment = (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      Swal.fire('Error', 'You must be logged in to add a comment.', 'error');
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/posts/${id}/addComment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({ content: newComment }),
    })
      .then(response => response.json())
      .then(data => {
        if (data._id) {
          setComments([...comments, data]);
          setNewComment('');
          Swal.fire('Success', 'Comment added successfully!', 'success');
        } else {
          Swal.fire('Error', 'Failed to add comment', 'error');
        }
      })
      .catch(error => Swal.fire('Error', 'Failed to add comment', 'error'));
  };

  const handleDeleteComment = (commentId) => {
    if (!isLoggedIn) {
      Swal.fire('Error', 'You must be logged in to delete a comment.', 'error');
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/posts/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'Comment deleted successfully') {
          setComments(comments.filter(comment => comment._id !== commentId));
          Swal.fire('Success', 'Comment deleted successfully!', 'success');
        } else {
          Swal.fire('Error', 'Failed to delete comment', 'error');
        }
      })
      .catch(error => Swal.fire('Error', 'Failed to delete comment', 'error'));
  };

  const handleEditBlog = () => {
    if (title === blog.title && content === blog.content) {
      Swal.fire('Info', 'No changes detected', 'info');
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/posts/update/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({ title, content }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.updatedBlog) {
          setBlog(data.updatedBlog);
          setEditMode(false);
          Swal.fire('Success', 'Blog updated successfully!', 'success');
        } else {
          Swal.fire('Error', 'Failed to update blog', 'error');
        }
      })
      .catch(error => Swal.fire('Error', 'Failed to update blog', 'error'));
  };

  const handleDeleteBlog = () => {
    fetch(`${import.meta.env.VITE_API_URL}/posts/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'Blog deleted successfully') {
          Swal.fire('Success', 'Blog deleted successfully!', 'success')
            .then(() => navigate('/'));
        } else {
          Swal.fire('Error', 'Failed to delete blog', 'error');
        }
      })
      .catch(error => Swal.fire('Error', 'Failed to delete blog', 'error'));
  };

  return (
    <div>
      <button className="back-button" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} /> Back
      </button>
      {blog ? (
        <div>
          <h1>
            {editMode ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
              />
            ) : (
              blog.title
            )}
          </h1>
          {editMode ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Content"
            />
          ) : (
            <div className="blog-content">
              <p>{blog.content}</p>
              <div className="blog-meta">
                <span className="blog-time">{moment(blog.createdAt).startOf('hour').fromNow()}</span>
              </div>
            </div>
          )}
          {isLoggedIn && (user?.isAdmin || user?._id === blog.author.toString()) && (
            <div>
              {editMode ? (
                <>
                  <button className="btn btn-primary mt-2 me-2" onClick={handleEditBlog}>Save</button>
                  <button className="btn btn-secondary mt-2" onClick={() => setEditMode(false)}>Cancel</button>
                </>
              ) : (
                <>
                  {user?._id === blog.author.toString() && !user.isAdmin && (
                    <>
                      <button className='edit' onClick={() => setEditMode(true)}>Edit</button>
                      <button className='delete' onClick={handleDeleteBlog}>Delete</button>
                    </>
                  )}
                  {user?.isAdmin && (
                    <>
                      <button className='edit' onClick={() => setEditMode(true)}>Edit</button>
                      <button className='delete' onClick={handleDeleteBlog}>Delete</button>
                    </>
                  )}
                </>
              )}
            </div>
          )}
          <div className='comment-container'>
            <h3 className='mt-5'>Comments</h3>
            {comments.length > 0 ? (
              <ul className='comment-list'>
                {comments.map(comment => (
                  <li className='comment-item' key={comment._id}>
                    <div className='comment-content'>
                      <p>
                        <span className='comment-author'>{comment.user.userName}:</span> {comment.content}
                      </p>
                      {isLoggedIn && (user?._id === comment.user._id || user?.isAdmin) && (
                        <div className='comment-actions'>
                          <button className='delete' onClick={() => handleDeleteComment(comment._id)}>Delete</button>
                        </div>
                      )}
                    </div>
                    <p className='comment-time'>
                      <small>{moment(comment.createdAt).startOf('hour').fromNow()}</small>
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No comments yet.</p>
            )}
            {isLoggedIn && (
              <form onSubmit={handleAddComment}>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment"
                  required
                />
                <button type="submit" className='submit-button'>Submit Comment</button>
              </form>
            )}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Blog;
