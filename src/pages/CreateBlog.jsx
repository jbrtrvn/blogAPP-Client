import React, { useState, useContext } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const { isLoggedIn, user } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      Swal.fire('Error', 'You must be logged in to create a blog.', 'error');
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/blogs/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({ title, content, authorId: user._id }),
    })
      .then(response => response.json())
      .then(data => {
        if (data._id) {
          Swal.fire('Success', 'Blog created successfully!', 'success')
            .then(() => navigate('/'));
        } else {
          Swal.fire('Error', 'Failed to create blog', 'error');
        }
      })
      .catch(error => Swal.fire('Error', 'Failed to create blog', 'error'));
  };

  return (
    <div>
      <button className="back-button" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} /> Back
      </button>
      <h1>Create Blog</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input 
            type="text" 
            className="form-control" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Content</label>
          <textarea 
            className="form-control" 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="btn btn-primary">Create Blog</button>
      </form>
    </div>
  );
};

export default CreateBlog;
