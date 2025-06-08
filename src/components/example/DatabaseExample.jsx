import React, { useState, useEffect } from 'react';
import { query } from '../../utils/db';

const DatabaseExample = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Example query - replace with your actual table name
        const result = await query('SELECT * FROM your_table LIMIT 10');
        setData(result.rows);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h2>Data from Aptible Database</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default DatabaseExample; 