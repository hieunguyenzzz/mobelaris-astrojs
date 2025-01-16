import React, { useState, useEffect } from 'react';
import { getRegions } from '../utils/medusa';

const RegionSelector = () => {
  const [regions, setRegions] = useState<any[]>([]);
  const [currentRegion, setCurrentRegion] = useState<string>('');

  useEffect(() => {
    const loadRegions = async () => {
      const regions = await getRegions();
      setRegions(regions);
      
      // Get current region from URL or default to first region
      const path = window.location.pathname;
      const regionCode = path.split('/')[1];
      const validRegion = regions.find(r => r.currency_code.toLowerCase() === regionCode);
      
      if (validRegion) {
        setCurrentRegion(regionCode);
      } else {
        // Default to first region if no valid region in URL
        const defaultRegion = regions[0]?.currency_code.toLowerCase();
        setCurrentRegion(defaultRegion);
        // Update URL with default region
        const newPath = `/${defaultRegion}${path}`;
        window.history.replaceState({}, '', newPath);
      }
    };

    loadRegions();
  }, []);

  const handleRegionChange = (regionCode: string) => {
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split('/');
    
    // Replace or add region code
    if (pathParts[1] && regions.some(r => r.currency_code.toLowerCase() === pathParts[1])) {
      pathParts[1] = regionCode;
    } else {
      pathParts.splice(1, 0, regionCode);
    }

    const newPath = pathParts.join('/');
    window.location.href = newPath;
  };

  return (
    <select 
      value={currentRegion}
      onChange={(e) => handleRegionChange(e.target.value)}
      style={{
        padding: '0.5rem',
        borderRadius: '4px',
        border: '1px solid #e2e8f0',
        backgroundColor: 'transparent',
        color: 'white'
      }}
    >
      {regions.map((region) => (
        <option 
          key={region.id} 
          value={region.currency_code.toLowerCase()}
          style={{ color: 'black' }}
        >
          {region.name} ({region.currency_code})
        </option>
      ))}
    </select>
  );
};

export default RegionSelector; 