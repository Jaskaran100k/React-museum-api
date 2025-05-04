import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

interface Art {
  objectID: number;
  title: string;
  artistDisplayName: string;
  primaryImageSmall: string;
  medium: string; // Added to capture the artwork's medium or classification
}

function App() {
  const [artworks, setArtworks] = useState<Art[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        // Fetch search results for artworks
        const searchRes = await axios.get(
          'https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=painting'
        );
        
        const objectIDs = searchRes.data.objectIDs.slice(60, 80); // Get 20 object IDs to match screenshot
        
        // Fetch details for each artwork
        const artworkDetails = await Promise.all(
          objectIDs.map((id: number) =>
            axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`)
          )
        );
        
        // Set the artworks data
        setArtworks(artworkDetails.map(res => res.data));

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  if (loading) return <p>Loading artworks...</p>;

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', backgroundColor: '#121212', color: '#eee', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>🖼️ The Met Artworks</h1>
  
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
        {artworks.map((art) => (
          <div
            key={art.objectID}
            style={{
              width: '220px',
              backgroundColor: '#1e1e1e',
              borderRadius: '8px',
              padding: '0.75rem',
              textAlign: 'center',
              boxShadow: '0 0 8px rgba(255, 255, 255, 0.05)',
            }}
          >
            {art.primaryImageSmall ? (
              <img
                src={art.primaryImageSmall}
                alt={art.title}
                style={{
                  width: '100%',
                  height: '160px', // Fixed height for consistency
                  objectFit: 'cover', // Ensure image fits nicely
                  borderRadius: '4px',
                  marginBottom: '0.5rem',
                }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '160px',
                  backgroundColor: '#333',
                  borderRadius: '4px',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#aaa',
                  fontSize: '0.85rem',
                }}
              >
                No image available
              </div>
            )}
            <h3 style={{ fontSize: '1rem', margin: '0.5rem 0', color: '#fff' }}>
              {art.medium || 'Unknown Medium'} {/* Display medium/classification */}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#aaa', margin: '0' }}>
              {art.artistDisplayName || 'Unknown Artist'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;