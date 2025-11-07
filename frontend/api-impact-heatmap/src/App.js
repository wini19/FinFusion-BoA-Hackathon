import React, { useState } from 'react';
import Heatmap from './components/Heatmap';
import RefactorAssistant from './components/RefactorAssistant';
import Header from './components/Header';
import Insights from './components/Insights';
import './styles.css';

function App() {
  const [selectedApi, setSelectedApi] = useState(null);
  const [similarityData, setSimilarityData] = useState(null);

  const handleApiClick = (api, similarity) => {
    setSelectedApi(api);
    setSimilarityData(Array.isArray(similarity) ? similarity : []);
  };

  return (
    <div className="app-container">
      <Header />
      <div className="split-screen">
        <section aria-label="Service Impact Heatmap" className="heatmap-section">
          <Heatmap onApiClick={handleApiClick} />
          <Insights />
        </section>
        <section aria-label="API Refactor Assistant" className="refactor-section">
          <RefactorAssistant selectedApi={selectedApi} similarityData={similarityData} />
        </section>
      </div>
    </div>
  );
}

export default App;