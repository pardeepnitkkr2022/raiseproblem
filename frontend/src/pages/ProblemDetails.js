import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProblem, addComment, voteProblem, deleteProblem, deleteComment, generateAiSolution } from '../api';
import './ProblemDetails.css';

const ProblemDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [problem, setProblem] = useState(null);
    const [comment, setComment] = useState('');
    const [voteType, setVoteType] = useState(null);
    const [error, setError] = useState(null); // State to hold error messages
    const [showModal, setShowModal] = useState(false);
    const [aiSolution, setAiSolution] = useState('');

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const { data } = await getProblem(id);
                console.log('Fetched problem:', data);
                setProblem(data);
            } catch (error) {
                console.error('Error fetching problem:', error.response?.data?.message || error.message);
                setError('Error fetching problem. Please try again later.');
            }
        };
        fetchProblem();
    }, [id]);

    const handleGenerateAiSolution = async () => {
        setShowModal(true);
        try {
            const response = await generateAiSolution(id);
            console.log(response.data.solution);
            
             setAiSolution(response.data.solution);
        } catch (error) {
            console.error('Error generating AI solution:', error);
            setAiSolution('Failed to generate AI solution.');
        }
    };
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            await addComment(id, { comment });
            console.log('Comment added:', { comment });
            setComment('');
            setProblem(prev => ({
                ...prev,
                comments: [...prev.comments, { comment, user: { name: 'You' } }]
            }));
        } catch (error) {
            console.error('Error adding comment:', error.response?.data?.message || error.message);
            setError('Error adding comment. Please try again later.');
        }
    };

    const handleVote = async (type) => {
        try {
            const { data } = await voteProblem(id, type);
            console.log('Vote result:', data);
            setVoteType(voteType === type ? null : type); // Toggle vote type
            setProblem(prev => ({
                ...prev,
                upvotes: data.upvotes,
                downvotes: data.downvotes
            }));
        } catch (error) {
            console.error('Error voting on problem:', error.response?.data?.message || error.message);
            setError('Error voting on problem. Please try again later.');
        }
    };

    const handleDeleteProblem = async () => {
        try {
            console.log('Deleting problem with id:', id);
            await deleteProblem(id);
            console.log('Problem deleted successfully');
            navigate('/problems');
        } catch (error) {
            console.error('Error deleting problem:', error.response?.data?.message || error.message);
            setError('Error deleting problem. Please try again later.');
        }
    };

  

    if (!problem) return <div>Loading...</div>;

    return (
        <div className="problem-details">
            <h2>{problem.title}</h2>
            <p>{problem.description}</p>
            <div className="tags">Tags: {problem.tags?.join(', ')}</div>
            <div className="user">Posted by: {problem.user?.name || 'Unknown'}</div>
            <div className="votes">
                <button
                    onClick={() => handleVote('upvote')}
                    disabled={voteType === 'downvote'}
                >
                    Upvote ({problem.upvotes || 0})
                </button>
                <button
                    onClick={() => handleVote('downvote')}
                    disabled={voteType === 'upvote'}
                >
                    Downvote ({problem.downvotes || 0})
                </button>
                <button onClick={handleDeleteProblem} className="delete-button">Delete Problem</button>
            </div>
            <div className="comments">
                <h3>Comments</h3>
                {error && <div className="error-message">{error}</div>}
                <ul>
                    {problem.comments?.map((c) => (
                        <li key={c._id}>
                            {c.comment} - {c.user?.name || 'Unknown'}
                            {c.user?.name === 'You' }
                        </li>
                    ))}
                </ul>
                <form onSubmit={handleCommentSubmit}>
                    <input
                        type="text"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Add a comment"
                        required
                    />
                    <button type="submit">Add Comment</button>
                </form>
            </div>

            <button onClick={handleGenerateAiSolution}>Generate AI Solution</button>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowModal(false)}>
                            &times;
                        </span>
                        <h2>AI Solution</h2>
                        <p>{aiSolution || 'Generating solution...'}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProblemDetails;
 