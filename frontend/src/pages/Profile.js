import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';
import { getProfile, updateProfilePicture } from '../api';

const Profile = () => {
    const [profileData, setProfileData] = useState({ user: {}, problems: [], comments: [] });
    const [image, setImage] = useState('/default-avatar.png');

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const { data } = await getProfile();
                setProfileData(data);
                setImage(data.pictureUrl || '/default-avatar.png'); // Set default if no picture
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };

        fetchProfileData();
    }, []);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        
        const formData = new FormData();
        formData.append('profilePicture', file);

        try {
            const { data } = await updateProfilePicture(formData);
            setProfileData(prev => ({ ...prev, pictureUrl: data.pictureUrl }));
            console.log(data);
            setImage(data.pictureUrl);
        } catch (error) {
            console.error('Error updating profile picture:', error);
        }
    };

    return (
        <div className="profile">
            <h2>Profile</h2>
            <div className="profile-details">
                <p><strong>Name:</strong> {profileData.user.name}</p>
                <p><strong>Email:</strong> {profileData.user.email}</p>
                <div className="profile-info">
                    <img
                        src={image}
                        alt="Profile"
                        className="profile-picture"
                    />
                    <input type="file" onChange={handleImageUpload} />
                </div>
            </div>
            <h2>Your Problems</h2>
            <ul className="problem-list__items">
                {profileData.problems.map((problem) => (
                    <li key={problem._id} className="problem-list__item">
                        <Link to={`/problems/${problem._id}`} className="problem-list__link">
                            <div className="problem-list__header">
                                <h2 className="problem-list__title">{problem.title}</h2>
                                <p className="problem-list__description">{problem.description}</p>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Profile;
