// Initial data for teams
let teamsData = [
    { name: 'Real Madrid', points: 12, goalsFor: 10, goalsAgainst: 4 },
    { name: 'Man City', points: 10, goalsFor: 12, goalsAgainst: 6 },
    { name: 'Liverpool', points: 9, goalsFor: 8, goalsAgainst: 3 },
    { name: 'Bayern', points: 15, goalsFor: 15, goalsAgainst: 5 },
    { name: 'PSG', points: 7, goalsFor: 6, goalsAgainst: 6 }
];

const leaderboard = d3.select('#leaderboard');

function updateBoard() {
    // Step 6: Sort data (Points descending, then Goal Difference)
    teamsData.sort((a, b) => (b.points - a.points) || ((b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst)));

    // Step 4 & 5: Data joining with Enter-Update-Exit
    const teams = leaderboard.selectAll('.team')
        .data(teamsData, d => d.name); // Bind data by team name

    teams.join(
        // Enter: New teams
        enter => enter.append('div')
            .attr('class', 'team team-enter')
            .style('opacity', 0)
            .style('transform', 'translateX(-20px)')
            .call(enter => enter.transition().duration(500)
                .style('opacity', 1)
                .style('transform', 'translateX(0)')),
        
        // Update: Existing teams
        update => update
            .attr('class', 'team team-update')
            .call(update => update.transition().duration(500)),

        // Exit: Removing teams
        exit => exit
            .attr('class', 'team team-exit')
            .call(exit => exit.transition().duration(500)
                .style('opacity', 0)
                .style('transform', 'translateX(20px)')
                .remove())
    )
    // Step 3: Update content
    .html((d, i) => `
        <span class="position">${i + 1}</span>
        <span class="name">${d.name}</span>
        <span class="points">PTS: ${d.points}</span>
        <span class="gd">GD: ${d.goalsFor - d.goalsAgainst}</span>
    `);
}

// Step 4: Simulate data changes
function updateData() {
    // Update points
    teamsData.forEach(d => {
        if (Math.random() > 0.5) d.points += 3;
    });

    // Add new team occasionally
    if (Math.random() > 0.8) {
        teamsData.push({ name: 'Team ' + Math.floor(Math.random() * 100), points: 5, goalsFor: 2, goalsAgainst: 2 });
    }

    // Remove team occasionally
    if (Math.random() > 0.8 && teamsData.length > 3) {
        teamsData.splice(Math.floor(Math.random() * teamsData.length), 1);
    }

    updateBoard();
}

// Step 4: Set interval for automatic updates
setInterval(updateData, 2500);

// Initial call
updateBoard();