// Sample player statistics data for MVP
const playerStats = {
    blocks: [
      { name: 'Stone Mined', value: 247 },
      { name: 'Dirt Collected', value: 156 },
      { name: 'Wood Chopped', value: 89 },
      { name: 'Coal Mined', value: 42 },
      { name: 'Iron Mined', value: 23 },
      { name: 'Diamond Mined', value: 4 }
    ],
    mobs: [
      { name: 'Zombies Killed', value: 37 },
      { name: 'Skeletons Killed', value: 28 },
      { name: 'Spiders Killed', value: 19 },
      { name: 'Creepers Killed', value: 12 },
      { name: 'Endermen Killed', value: 3 }
    ],
    items: [
      { name: 'Items Crafted', value: 153 },
      { name: 'Food Consumed', value: 87 },
      { name: 'Tools Broken', value: 24 },
      { name: 'Deaths', value: 7 },
      { name: 'Distance Traveled (blocks)', value: 14392 }
    ]
  };
  
  // Function to get all player stats
  export const getPlayerStats = () => {
    return playerStats;
  };
  
  // Function to update a specific stat
  export const updateStat = (category, statName, newValue) => {
    const stat = playerStats[category].find(s => s.name === statName);
    
    if (stat) {
      stat.value = newValue;
      return true;
    }
    
    return false;
  };
  
  // Function to increment a specific stat
  export const incrementStat = (category, statName, amount = 1) => {
    const stat = playerStats[category].find(s => s.name === statName);
    
    if (stat) {
      stat.value += amount;
      return true;
    }
    
    return false;
  };
  
  // Function to add a new stat
  export const addStat = (category, statName, initialValue = 0) => {
    if (!playerStats[category]) {
      return false;
    }
    
    if (playerStats[category].some(s => s.name === statName)) {
      return false;
    }
    
    playerStats[category].push({
      name: statName,
      value: initialValue
    });
    
    return true;
  };