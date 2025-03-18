import { searchRecipes, getRecipeById } from '../data/recipes';
import { getPlayerStats } from '../data/playerStats';

// Simple keyword matching for MVP
const KEYWORDS = {
  GREETING: ['hello', 'hi', 'hey', 'greetings'],
  RECIPE: ['recipe', 'craft', 'make', 'build', 'how to make', 'how to craft', 'how to build'],
  STATS: ['stats', 'statistics', 'progress', 'achievement'],
  HELP: ['help', 'assist', 'support', 'guide'],
  BLOCKS: ['block', 'stone', 'dirt', 'wood', 'cobblestone', 'iron', 'gold', 'diamond'],
  TOOLS: ['tool', 'pickaxe', 'axe', 'shovel', 'hoe', 'sword'],
  MOBS: ['mob', 'zombie', 'skeleton', 'creeper', 'spider', 'enderman']
};

// Process user messages and generate responses
export const processMessage = (message) => {
  const lowerMessage = message.toLowerCase();
  
  // Check for greetings
  if (KEYWORDS.GREETING.some(word => lowerMessage.includes(word))) {
    return {
      text: "Hello! I'm ChatStevePT. How can I help with your Minecraft adventure today?"
    };
  }
  
  // Check for help
  if (KEYWORDS.HELP.some(word => lowerMessage.includes(word))) {
    return {
      text: "I can help you with crafting recipes, track your stats, and answer questions about Minecraft. Try asking me 'How do I craft a wooden pickaxe?' or 'Show me my mining stats'."
    };
  }
  
  // Check for recipe queries
  if (KEYWORDS.RECIPE.some(word => lowerMessage.includes(word))) {
    // Extract what the user wants to craft
    let itemToSearch = '';
    
    for (const block of KEYWORDS.BLOCKS) {
      if (lowerMessage.includes(block)) {
        itemToSearch = block;
        break;
      }
    }
    
    for (const tool of KEYWORDS.TOOLS) {
      if (lowerMessage.includes(tool)) {
        itemToSearch = tool;
        break;
      }
    }
    
    if (!itemToSearch) {
      // Try to extract from general message
      const recipeWords = lowerMessage.split(' ');
      const recipeIndex = recipeWords.findIndex(word => 
        KEYWORDS.RECIPE.some(kw => word.includes(kw))
      );
      
      if (recipeIndex !== -1 && recipeIndex < recipeWords.length - 1) {
        itemToSearch = recipeWords.slice(recipeIndex + 1).join(' ');
      }
    }
    
    if (itemToSearch) {
      const recipes = searchRecipes(itemToSearch);
      
      if (recipes.length > 0) {
        const recipe = recipes[0];
        return {
          text: `To craft a ${recipe.name}, you need ${recipe.materials.map(m => `${m.count} ${m.item}`).join(', ')}. ${recipe.description}`,
          recipes: recipes
        };
      } else {
        return {
          text: `I don't have information on crafting "${itemToSearch}" in my current database. Please try another item.`
        };
      }
    } else {
      return {
        text: "What would you like to craft? Try asking me about specific items like 'How do I craft a wooden pickaxe?'"
      };
    }
  }
  
  // Check for stats queries
  if (KEYWORDS.STATS.some(word => lowerMessage.includes(word))) {
    const stats = getPlayerStats();
    
    if (lowerMessage.includes('block') || lowerMessage.includes('mine')) {
      const blockStats = stats.blocks.map(s => `${s.name}: ${s.value}`).join(', ');
      return {
        text: `Here are your block mining stats: ${blockStats}`,
        stats: 'blocks'
      };
    }
    
    if (lowerMessage.includes('mob') || lowerMessage.includes('kill')) {
      const mobStats = stats.mobs.map(s => `${s.name}: ${s.value}`).join(', ');
      return {
        text: `Here are your mob kill stats: ${mobStats}`,
        stats: 'mobs'
      };
    }
    
    // Default to showing general stats
    return {
      text: "I can show you stats for blocks mined, mobs killed, and other activities. What specifically would you like to know about?",
      stats: 'general'
    };
  }
  
  // Default response for unrecognized queries
  return {
    text: "I'm not sure how to help with that yet. Try asking me about crafting recipes or your player stats!"
  };
};

// Export additional utility functions
export const generateCraftingGuide = (itemName) => {
  const recipes = searchRecipes(itemName);
  
  if (recipes.length === 0) {
    return `I don't have crafting information for ${itemName}.`;
  }
  
  const recipe = recipes[0];
  let guide = `# Crafting Guide: ${recipe.name}\n\n`;
  
  guide += "## Materials Needed:\n";
  recipe.materials.forEach(material => {
    guide += `- ${material.count} × ${material.item}\n`;
  });
  
  guide += "\n## Crafting Pattern:\n";
  guide += "```\n";
  recipe.pattern.forEach(row => {
    guide += `| ${row[0] || ' '} | ${row[1] || ' '} | ${row[2] || ' '} |\n`;
  });
  guide += "```\n";
  
  guide += `\n## Result: ${recipe.result}\n`;
  guide += `\n${recipe.description}\n`;
  
  return guide;
};