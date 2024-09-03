import React, { useEffect, useState } from 'react';
import { getProblems } from '../api'; // Update with your API call file
import { Link } from 'react-router-dom';
import './ProblemList.css'; // Ensure you have this CSS file for styling

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [searchTag, setSearchTag] = useState('');
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await getProblems(searchTag);
        setProblems(data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };
    fetchProblems();
  }, [searchTag]);
      const handleTagSearch = (e) => {
        setSearchTag(e.target.value);
    };

  return (
    <div className="problem-list">
      <h1 className="problem-list__title">Problem List</h1>
     <div className="inputbar">
      <input
                type="text"
                placeholder="Search by tag"
                value={searchTag}
                onChange={handleTagSearch}
            />
            </div> 
      <ul className="problem-list__items">
        {problems.length > 0 ? (
          problems.map((problem) => (
            <li key={problem._id} className="problem-list__item">
              <Link to={`/problems/${problem._id}`} className="problem-list__link">
                <div className="problem-list__header">
                  <h2 className="problem-list__title">{problem.title}</h2>
                  <p className="problem-list__description">{problem.description}</p>
                </div>
              </Link>
            </li>
          ))
        ) : (
          <p className="problem-list__empty">No problems available</p>
        )}
      </ul>
    </div>
  );
};

export default ProblemList;

// import React, { useEffect, useState } from 'react';
// import { getProblems } from '../api';
// import './ProblemList.css';

// const ProblemList = () => {
//     const [problems, setProblems] = useState([]);
//     const [searchTag, setSearchTag] = useState('');

//     useEffect(() => {
//         const fetchProblems = async () => {
//             const response = await getProblems(searchTag);
//             setProblems(response.data);
//         };
//         fetchProblems();
//     }, [searchTag]);

//     const handleTagSearch = (e) => {
//         setSearchTag(e.target.value);
//     };

//     return (
//         <div className="problem-list">
//             <h2>Problem List</h2>
//             <input
//                 type="text"
//                 placeholder="Search by tag"
//                 value={searchTag}
//                 onChange={handleTagSearch}
//             />
//             <ul className="problem-list__items">
//                 {problems.map((problem) => (
//                     <li key={problem._id} className="problem-list__item">
//                         <h3>{problem.title}</h3>
//                         <p>{problem.description}</p>
//                         <p><strong>Tags:</strong> {problem.tags.join(', ')}</p>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default ProblemList;

