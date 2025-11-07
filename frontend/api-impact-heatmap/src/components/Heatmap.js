import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { getUsageData, getFingerprintData, getSimilarityData } from './API';

const Heatmap = ({ onApiClick }) => {
  const svgRef = useRef();
  const [heatmapData, setHeatmapData] = useState([]);
  const [flyoutData, setFlyoutData] = useState(null);

  const handleHover = async (id) => {
    const data = await getFingerprintData(id);
    return data;
  };

  const handleClick = async (d) => {
    try {
      //  call Similarity API here
      console.log("id", d.apiId)
      const similarity = await getSimilarityData(d.apiId);
      onApiClick(d, similarity); // pass both API info and similarity result
    } catch (err) {
      console.error("Error fetching similarity data:", err);
    }
  };
  
  // Fetch data once on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getUsageData();
        setHeatmapData(data);
      } catch (err) {
        console.error("Error fetching usage data:", err);
      }
    }
    fetchData();
  }, []);

  // Draw heatmap after data is fetched
  useEffect(() => {
    if (heatmapData.length === 0) return; // Wait for data

    const columns = 5;
    const cellSize = 120;
    const width = columns * cellSize;
    const height = Math.ceil(heatmapData.length / columns) * cellSize;

    // assign grid positions
    heatmapData.forEach((d, i) => {
      d.x = i % columns;
      d.y = Math.floor(i / columns);
    });

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('font-family', 'Arial');

    svg.selectAll('*').remove(); // ✅ clear previous render

    const colorScale = d3.scaleSequential()

  .interpolator(d3.interpolateRgb("#ff0000", "#00ffff")) // Hot Red to Ice Cold

  .domain([d3.max(heatmapData, d => d.impactScore), 0]);

    // Tooltip
    const flyout = d3.select('body').append('div')
      .attr('class', 'flyout')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', '#fff')
      .style('color', '#333')
      .style('padding', '10px 15px')
      .style('border', '1px solid #ccc')
      .style('border-radius', '6px')
      .style('box-shadow', '0 4px 8px rgba(0,0,0,0.1)')
      .style('pointer-events', 'none')
      .style('font-size', '14px');

    const cells = svg.selectAll('g')
      .data(heatmapData)
      .join('g')
      .attr('transform', d => `translate(${d.x * cellSize}, ${d.y * cellSize})`);

    // Rectangles
    cells.append('rect')
      .attr('width', cellSize - 10)
      .attr('height', cellSize - 10)
      .attr('rx', 12)
      .attr('ry', 12)
      .attr('fill', d => colorScale(d.impactScore))
      .attr('tabindex', 0)
      .attr('aria-label', d => `API ${d.apiName}, Impact ${d.impactScore}`)
      .on('mouseover', async(event, d) => {
           // Fetch detailed fingerprint data when hovered
    try {
      const fingerprint = await handleHover(d.apiId);
      if (fingerprint) {
        flyout.html(`
          <strong>${fingerprint.apiName}</strong><br/>
          Calls: ${d.calls}<br/>
          Consumers: ${d.consumers}<br/>
          Impact Score: ${d.impactScore}<br/>
          Tags: ${fingerprint.tags}<br/>
          <hr/>
         
        `);
      } else {
        flyout.html(`
          <strong>${d.apiName}</strong><br/>
          Calls: ${d.calls}<br/>
          Consumers: ${d.consumers}<br/>
          Impact Score: ${d.impactScore}
        `);
      }
    } catch (err) {
      console.error("Error fetching fingerprint data:", err);
    }

    flyout
      .style('visibility', 'visible')
      .style('opacity', 1);

    d3.select(event.currentTarget)
      .style('stroke', '#000')
      .style('stroke-width', '2px');
  })
      .on('mousemove', (event) => {
        flyout.style('top', (event.pageY + 10) + 'px')
              .style('left', (event.pageX + 10) + 'px');
      })
      .on('mouseout', (event) => {
        flyout.style('visibility', 'hidden').style('opacity', 0);
        d3.select(event.currentTarget)
          .style('stroke', 'none');
      })
      .on('click', (event, d) => {
        // onApiClick(d);
        handleClick(d);
      });

    // Labels
    cells.append('text')
      .attr('text-anchor', 'middle')
      .attr('fill', 'black')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .each(function (d) {
        const words = d.owningService.split(' ');
        const maxCharsPerLine = 10;
        let line = '';
        const lines = [];

        words.forEach(word => {
          if ((line + word).length > maxCharsPerLine) {
            lines.push(line.trim());
            line = word + ' ';
          } else {
            line += word + ' ';
          }
        });
        if (line) lines.push(line.trim());

        const textElement = d3.select(this);
        const totalHeight = lines.length * 16;
        const startY = ((cellSize - 10) / 2) - (totalHeight / 2);

        lines.forEach((l, i) => {
          textElement.append('tspan')
            .attr('x', (cellSize - 10) / 2)
            .attr('y', startY + i * 16)
            .text(l);
        });
      });

  }, [heatmapData]); // ✅ depend on data changes

  return <svg ref={svgRef}></svg>;
};

export default Heatmap;

