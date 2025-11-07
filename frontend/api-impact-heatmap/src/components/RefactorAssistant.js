import React , {useEffect, axios, useState} from 'react';
import { FaInfoCircle } from 'react-icons/fa';


const RefactorAssistant = ({ selectedApi, similarityData }) => {
  const suggestions = [
    { title: 'Combine Endpoints', description: 'Merge similar endpoints to reduce redundancy and improve maintainability.' },
    { title: 'Improve Naming', description: 'Use consistent naming conventions across all APIs for better clarity.' },
    { title: 'Add Pagination', description: 'Implement pagination for large data sets to optimize performance.' },
    { title: 'Enhance Security', description: 'Apply OAuth2 and validate input to prevent security vulnerabilities.' }
  ];
  //  Normalize similarityData to always be an array
  const normalizedData = Array.isArray(similarityData)
    ? similarityData
    : similarityData
    ? [similarityData]
    : [];
// console.log(selectedApi.apiName)
  return (
    <div>
      {/* Similarity Analysis Card */}
      <div className="similarity-card standout">
        <div className="similarity-header">
          <h4>🔍 Similarity Analysis</h4>
          <FaInfoCircle className="info-icon" />
        </div>
        {!selectedApi ? (
          <div className="info-message">
            <span>Click on an API in the heatmap to view similar APIs.</span>
          </div>
        ) : similarityData === null ? (
          // STATE 2: Waiting for data
          <div className="info-message">
            <span>Loading similarity data...</span>
          </div>
        ) : similarityData.length === 0 ? (
          // STATE 3: Empty response
          <div className="no-results">
            <h5>No Similar APIs Found</h5>
            <p>The selected API (<strong>{selectedApi.owningService}</strong>) has no close matches based on the similarity analysis.</p>
          </div>
        ) : (
                // STATE 4: Data available
          <div className="similarity-results">
            <p><strong>Similarity Check Results:</strong></p>
            <div
              className={`similarity-grid ${
                normalizedData.length > 1 ? 'multi' : 'single'
              }`}
            >
              {normalizedData.map((dup, index) => {
                const similarityPercent = (dup.similarity * 100).toFixed(1); // Convert 0.9294 → 92.9%
                return (
                  <div key={index} className="similarity-item">
                    <h5>
                      {selectedApi.apiName} vs {dup.apiName}
                    </h5>
                    <div
                      className={`score-badge ${
                        similarityPercent >= 75
                          ? 'high'
                          : similarityPercent >= 50
                          ? 'medium'
                          : 'low'
                      }`}
                    >
                      {similarityPercent}% Similar
                    </div>
                    <div className="progress-bar">
                      <div style={{ width: `${similarityPercent}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* API Refactor Assistant */}
      <h2>API Refactor Assistant</h2>
      <div className="suggestions-container">
        <h3>Refactor Suggestions</h3>
        <div className="suggestion-cards">
          {suggestions.map((item, index) => (
            <div key={index} className="suggestion-card">
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RefactorAssistant;
