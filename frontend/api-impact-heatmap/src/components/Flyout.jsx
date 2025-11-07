<div className="similarity-card">
<div className="similarity-header">
  <h4>Similarity Analysis</h4>
  <FaInfoCircle className="info-icon" />
</div>
{!selectedApi ? (
  <div className="info-message">
    <span>Click on an API in the heatmap to view similar APIs.</span>
  </div>
) : (
  <div className="similarity-results">
    <p><strong>Similarity Check Results:</strong></p>
    <div className="similarity-list">
      {similarityData.duplicates.map((dup, index) => (
        <div key={index} className="similarity-row">
          <span className="api-name">{dup.name}</span>
          <span className={`similarity-score ${dup.score >= 75 ? 'high' : dup.score >= 50 ? 'medium' : 'low'}`}>
            {dup.score}% similarity
          </span>
        </div>
      ))}
    </div>
  </div>
)}
</div>