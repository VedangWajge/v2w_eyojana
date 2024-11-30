import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './profile.css';

const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState({
    username: '',
    email: '',
    phoneNo: '',
    gender: '',
    state: ''
    
  });

  const loggedInUserEmail = localStorage.getItem('email'); // Assuming email is stored here after login
  const genderOptions = ['Male', 'Female', 'Other'];
  const stateOptions = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands',
    'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Lakshadweep',
    'Delhi', 'Puducherry', 'Jammu and Kashmir', 'Ladakh'
  ];
  // Fetch user data based on email
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/auth/profile/${loggedInUserEmail}`); // Adjust the API endpoint as per your backend
        const data = await response.json();
        
        if (response.ok) {
          setUser(data);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (loggedInUserEmail) {
      fetchUserData();
    }
  }, [loggedInUserEmail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleEdit = async () => {
    if (editMode) {
      // Save the updated data to the backend
      try {
        const response = await fetch(`http://localhost:5000/api/auth/update/${loggedInUserEmail}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(user) // Send the updated user data
        });

        if (response.ok) {
          console.log('Profile updated successfully');
        } else {
          console.error('Failed to update profile');
        }
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
    setEditMode(!editMode); // Toggle the edit mode
  };

  return (
<Container className="profile-page">
      <Row className="justify-content-md-center">
        <Col md="8">
          <h2 className="my-profile-title">My Profile</h2>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group controlId="formUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={user.username}
                    onChange={handleChange}
                    style={{ cursor: editMode ? 'auto' : 'not-allowed' }}
                    readOnly={!editMode}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    style={{ cursor:  'not-allowed' }}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group controlId="formPhoneNo">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="phoneNo"
                    value={user.phoneNo}
                    onChange={handleChange}
                    style={{ cursor: editMode ? 'auto' : 'not-allowed' }}
                    readOnly={!editMode}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formGender">
                  <Form.Label>Gender</Form.Label>
                  <Form.Control
                    as="select"
                    name="gender"
                    value={user.gender}
                    onChange={handleChange}
                    disabled={!editMode}
                    style={{ cursor: editMode ? 'auto' : 'not-allowed' }} // Set cursor style
                  >
                    <option value="">Select Gender</option>
                    {genderOptions.map((gender) => (
                      <option key={gender} value={gender}>{gender}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group controlId="formState">
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    as="select"
                    name="state"
                    value={user.state}
                    onChange={handleChange}
                    disabled={!editMode}
                    style={{ cursor: editMode ? 'auto' : 'not-allowed' }} // Set cursor style
                  >
                    <option value="">Select State</option>
                    {stateOptions.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </Form>
          <Row className="mt-4">
            <Col className="text-center">
              <Button className='editbtn' variant={editMode ? "success" : "primary"} onClick={handleEdit}>
                {editMode ? 'Save' : 'Edit'}
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
