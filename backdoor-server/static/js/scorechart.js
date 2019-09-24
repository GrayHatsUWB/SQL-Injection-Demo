/* global $, Chart */
$(document).ready(function() {
  function createConfig(teams) {
    let datasets = []

    for (let team of teams) {
      datasets.push({
        label: 'Team ' + team.name,
        //        steppedLine: 'before',
        lineTension: 0,
        borderColor: team.color,
        fill: false,
        data: team.data
      })
    }

    return {
      type: 'line',
      data: {
        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
        datasets: datasets
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: "Scores"
        }
      }
    }
  }

  let teams = [
    {
      name: 'Red',
      color: 'red',
      data: [0, 10, 50, 90]
    },
    {
      name: 'Blue',
      color: 'blue',
      data: [0, 0, 10, 15]
    },
    {
      name: 'Green',
      color: 'green',
      data: [20, 50, 55, 80]
    }
  ]

  function findTeam(name) {
    for (let team of teams) {
      if (team.name === name) return team
    }

    console.warn("Can't find team " + name)
    return null
  }

  // Get the latest set of data
  $.get('/scores')
    .done(function(latestData) {
      for (let data of latestData) {
        findTeam(data.team).data.push(data.score)
      }
    })
    .always(function () {
      var ctx = document.getElementById('score-chart').getContext('2d')
      var chart = new Chart(ctx, createConfig(teams))
    })
})
