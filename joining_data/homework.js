// Constants for dimensions
const width = 800;
const height = 400;
const margin = { top: 40, right: 20, bottom: 60, left: 60 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const svg = d3.select('svg')
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

let allData = [];

// Scales
const xScale = d3.scaleBand().range([0, innerWidth]).padding(0.2);
const yScale = d3.scaleLinear().range([innerHeight, 0]);

// Axes Groups
const xAxisG = svg.append('g').attr('transform', `translate(0, ${innerHeight})`);
const yAxisG = svg.append('g');

// Load Data
d3.csv('vancouver_trails.csv').then(data => {
    allData = data;
    updateChart(data); // Initial render

    // Event listeners for filtering
    d3.selectAll('button').on('click', function() {
        const difficulty = d3.select(this).attr('id');
        const filteredData = (difficulty === 'all') 
            ? allData 
            : allData.filter(d => d.difficulty === difficulty);
        updateChart(filteredData);
    });
});

function updateChart(data) {
    // Process data: count by difficulty
    const counts = d3.rollups(data, v => v.length, d => d.difficulty)
                     .map(([key, value]) => ({ difficulty: key, count: value }));

    // Update scales
    xScale.domain(counts.map(d => d.difficulty));
    yScale.domain([0, d3.max(counts, d => d.count)]);

    // Render Axes
    xAxisG.transition().duration(1000).call(d3.axisBottom(xScale));
    yAxisG.transition().duration(1000).call(d3.axisLeft(yScale));

    // Join pattern with transitions
    svg.selectAll('rect')
        .data(counts, d => d.difficulty)
        .join(
            enter => enter.append('rect')
                .attr('x', d => xScale(d.difficulty))
                .attr('y', innerHeight) // Start from bottom
                .attr('width', xScale.bandwidth())
                .attr('height', 0) // Start with 0 height
                .style('opacity', 0) // Fade in start
                .call(enter => enter.transition().duration(1000)
                    .attr('y', d => yScale(d.count))
                    .attr('height', d => innerHeight - yScale(d.count))
                    .style('opacity', 1)),
            update => update.call(update => update.transition().duration(1000)
                .attr('x', d => xScale(d.difficulty))
                .attr('y', d => yScale(d.count))
                .attr('width', xScale.bandwidth())
                .attr('height', d => innerHeight - yScale(d.count))),
            exit => exit.call(exit => exit.transition().duration(1000)
                .attr('y', innerHeight)
                .attr('height', 0)
                .style('opacity', 0)
                .remove())
        );
}