// src/services/MinecraftDataService.js
import minecraftData from 'minecraft-data';
import imageService from './ImageService';

/**
 * A comprehensive service for managing Minecraft recipe data
 */
class MinecraftDataService {
  constructor() {
    this.mcData = null;
    this.recipes = [];
    this.items = {};
    this.categories = {
      tools: [],
      weapons: [],
      armor: [],
      food: [],
      transportation: [],
      redstone: [],
      decoration: [],
      building: [],
      miscellaneous: []
    };
    this.initialized = false;
    this.version = '1.19';
    
    // Mapping between item names and texture filenames
    this.textureMap = this.createTextureMap();
  }

  /**
   * Create a mapping between item names in minecraft-data and texture filenames
   * @returns {Object} - Mapping object
   */
  createTextureMap() {
    return {
      // Tools
      'wooden_pickaxe': 'wooden_pickaxe',
      'stone_pickaxe': 'stone_pickaxe',
      'iron_pickaxe': 'iron_pickaxe',
      'golden_pickaxe': 'golden_pickaxe',
      'diamond_pickaxe': 'diamond_pickaxe',
      'netherite_pickaxe': 'netherite_pickaxe',
      
      'wooden_axe': 'wooden_axe',
      'stone_axe': 'stone_axe',
      'iron_axe': 'iron_axe',
      'golden_axe': 'golden_axe',
      'diamond_axe': 'diamond_axe',
      'netherite_axe': 'netherite_axe',
      
      'wooden_shovel': 'wooden_shovel',
      'stone_shovel': 'stone_shovel',
      'iron_shovel': 'iron_shovel',
      'golden_shovel': 'golden_shovel',
      'diamond_shovel': 'diamond_shovel',
      'netherite_shovel': 'netherite_shovel',
      
      'wooden_hoe': 'wooden_hoe',
      'stone_hoe': 'stone_hoe',
      'iron_hoe': 'iron_hoe',
      'golden_hoe': 'golden_hoe',
      'diamond_hoe': 'diamond_hoe',
      'netherite_hoe': 'netherite_hoe',
      
      // Weapons
      'wooden_sword': 'wooden_sword',
      'stone_sword': 'stone_sword',
      'iron_sword': 'iron_sword',
      'golden_sword': 'golden_sword',
      'diamond_sword': 'diamond_sword',
      'netherite_sword': 'netherite_sword',
      'bow': 'bow',
      'arrow': 'arrow',
      
      // Armor
      'leather_helmet': 'leather_helmet',
      'leather_chestplate': 'leather_chestplate',
      'leather_leggings': 'leather_leggings',
      'leather_boots': 'leather_boots',
      
      'iron_helmet': 'iron_helmet',
      'iron_chestplate': 'iron_chestplate',
      'iron_leggings': 'iron_leggings',
      'iron_boots': 'iron_boots',
      
      'golden_helmet': 'golden_helmet',
      'golden_chestplate': 'golden_chestplate',
      'golden_leggings': 'golden_leggings',
      'golden_boots': 'golden_boots',
      
      'diamond_helmet': 'diamond_helmet',
      'diamond_chestplate': 'diamond_chestplate',
      'diamond_leggings': 'diamond_leggings',
      'diamond_boots': 'diamond_boots',
      
      'netherite_helmet': 'netherite_helmet',
      'netherite_chestplate': 'netherite_chestplate',
      'netherite_leggings': 'netherite_leggings',
      'netherite_boots': 'netherite_boots',
      
      // Materials
      'stick': 'stick',
      'oak_planks': 'oak_planks',
      'spruce_planks': 'spruce_planks',
      'birch_planks': 'birch_planks',
      'jungle_planks': 'jungle_planks',
      'acacia_planks': 'acacia_planks',
      'dark_oak_planks': 'dark_oak_planks',
      'crimson_planks': 'crimson_planks',
      'warped_planks': 'warped_planks',
      
      'cobblestone': 'cobblestone',
      'iron_ingot': 'iron_ingot',
      'gold_ingot': 'gold_ingot',
      'diamond': 'diamond',
      'netherite_ingot': 'netherite_ingot',
      'redstone': 'redstone_dust',
      'coal': 'coal',
      
      // Basic blocks
      'crafting_table': 'crafting_table_top',
      'furnace': 'furnace_front',
      'chest': 'chest_front',
      'torch': 'torch',
      'bookshelf': 'bookshelf',
      'tnt': 'tnt_side',
      
      // Redstone components
      'redstone_torch': 'redstone_torch',
      'lever': 'lever',
      'redstone_lamp': 'redstone_lamp',
      'repeater': 'repeater',
      'comparator': 'comparator',
      'piston': 'piston_top',
      'sticky_piston': 'sticky_piston_top',
      'observer': 'observer_front',
      'dispenser': 'dispenser_front',
      'dropper': 'dropper_front',
      'hopper': 'hopper',
      'daylight_detector': 'daylight_detector_top',
      
      // Transportation
      'rail': 'rail',
      'powered_rail': 'powered_rail',
      'detector_rail': 'detector_rail',
      'activator_rail': 'activator_rail',
      'minecart': 'minecart',
      'chest_minecart': 'chest_minecart',
      'furnace_minecart': 'furnace_minecart',
      'hopper_minecart': 'hopper_minecart',
      'tnt_minecart': 'tnt_minecart',
      'oak_boat': 'oak_boat',
      
      // Food
      'apple': 'apple',
      'bread': 'bread',
      'cooked_porkchop': 'cooked_porkchop',
      'golden_apple': 'golden_apple',
      'enchanted_golden_apple': 'enchanted_golden_apple',
      'cake': 'cake',
      
      // Miscellaneous
      'ender_pearl': 'ender_pearl',
      'blaze_powder': 'blaze_powder',
      'book': 'book',
      'compass': 'compass',
      'clock': 'clock',
      'shears': 'shears',
      'bucket': 'bucket',
      'water_bucket': 'water_bucket',
      'lava_bucket': 'lava_bucket',
      'flint_and_steel': 'flint_and_steel',
      'lead': 'lead',
      'name_tag': 'name_tag',
    };
  }

  /**
   * Initialize the service with the specified Minecraft version
   * @param {string} version - Minecraft version (e.g., '1.19')
   * @returns {Promise} - Resolves when initialization is complete
   */
  async initialize(version = '1.19') {
    if (this.initialized && this.version === version) {
      return Promise.resolve();
    }

    this.version = version;
    return new Promise((resolve) => {
      // Initialize minecraft-data with the specified version
      this.mcData = minecraftData(version);
      this.processRecipes();
      this.categorizeRecipes();
      this.initialized = true;
      console.log(`MinecraftDataService initialized with version ${version}`);
      console.log(`Loaded ${this.recipes.length} recipes and ${Object.keys(this.items).length} items`);
      resolve();
    });
  }

  /**
   * Process all recipes from minecraft-data into our format
   */
  processRecipes() {
    this.recipes = [];
    this.items = {};

    // Process all items first
    Object.values(this.mcData.items).forEach(item => {
      this.items[item.id] = {
        id: item.id,
        name: item.name,
        displayName: item.displayName || item.name,
        stackSize: item.stackSize || 64,
        category: this.determineItemCategory(item),
        textureFile: this.getTextureFilename(item.name)
      };
    });

    // Then process recipes
    Object.entries(this.mcData.recipes).forEach(([resultId, recipeList]) => {
      const item = this.mcData.items[resultId];
      if (!item) return;

      recipeList.forEach(recipe => {
        const formattedRecipe = this.formatRecipe(item, recipe);
        if (formattedRecipe) {
          this.recipes.push(formattedRecipe);
        }
      });
    });

    // Sort recipes alphabetically
    this.recipes.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Get the texture filename for an item
   * @param {string} itemName - Item name
   * @returns {string} - Texture filename or null if not mapped
   */
  getTextureFilename(itemName) {
    const normalizedName = itemName.toLowerCase().replace(/\s+/g, '_');
    return this.textureMap[normalizedName] || normalizedName;
  }

  /**
   * Determine which category an item belongs to
   * @param {Object} item - Minecraft item object
   * @returns {string} - Category name
   */
  determineItemCategory(item) {
    const name = item.name.toLowerCase();
    
    if (name.includes('pickaxe') || name.includes('axe') || 
        name.includes('shovel') || name.includes('hoe') ||
        name.includes('shears') || name.includes('fishing') ||
        name.includes('flint_and_steel')) {
      return 'tools';
    } else if (name.includes('sword') || name.includes('bow') ||
               name.includes('arrow') || name.includes('trident')) {
      return 'weapons';
    } else if (name.includes('helmet') || name.includes('chestplate') ||
               name.includes('leggings') || name.includes('boots') ||
               name.includes('shield')) {
      return 'armor';
    } else if (this.mcData.foods && this.mcData.foods[item.id] ||
              name.includes('apple') || name.includes('bread') ||
              name.includes('meat') || name.includes('porkchop') ||
              name.includes('fish') || name.includes('cake') ||
              name.includes('stew') || name.includes('soup')) {
      return 'food';
    } else if (name.includes('boat') || name.includes('minecart') ||
               name.includes('saddle') || name.includes('elytra')) {
      return 'transportation';
    } else if (name.includes('redstone') || name.includes('piston') ||
               name.includes('repeater') || name.includes('comparator') ||
               name.includes('hopper') || name.includes('observer') ||
               name.includes('dropper') || name.includes('dispenser')) {
      return 'redstone';
    } else if (name.includes('door') || name.includes('bed') ||
               name.includes('banner') || name.includes('carpet') ||
               name.includes('sign') || name.includes('painting') ||
               name.includes('flower') || name.includes('pot')) {
      return 'decoration';
    } else if (this.mcData.blocks && this.mcData.blocks[item.id] &&
              !name.includes('redstone') && !name.includes('door')) {
      return 'building';
    } else {
      return 'miscellaneous';
    }
  }

  /**
   * Categorize all recipes based on their output item
   */
  categorizeRecipes() {
    // Reset categories
    Object.keys(this.categories).forEach(category => {
      this.categories[category] = [];
    });

    // Assign recipes to categories
    this.recipes.forEach(recipe => {
      const resultItem = this.items[recipe.resultId];
      if (resultItem && resultItem.category) {
        this.categories[resultItem.category].push(recipe);
      } else {
        this.categories.miscellaneous.push(recipe);
      }
    });
  }

  /**
   * Format a recipe into our application's recipe format
   * @param {Object} item - Result item
   * @param {Object} recipe - Minecraft recipe data
   * @returns {Object} - Formatted recipe
   */
  formatRecipe(item, recipe) {
    // Create result object with standard properties
    const formattedRecipe = {
      id: `${item.name.toLowerCase().replace(/\s+/g, '_')}_${this.recipes.length}`,
      name: item.displayName || item.name,
      resultId: item.id,
      resultCount: recipe.result ? recipe.result.count || 1 : 1,
      type: recipe.inShape ? 'shaped' : recipe.ingredients ? 'shapeless' : 'unknown',
      craftingTable: recipe.requiresTable !== false,
      materials: [],
      description: this.generateDescription(item),
      textureFile: this.getTextureFilename(item.name)
    };

    // Handle shaped recipes (normal crafting grid patterns)
    if (recipe.inShape) {
      formattedRecipe.pattern = this.processShapedRecipe(recipe.inShape, formattedRecipe.materials);
    } 
    // Handle shapeless recipes (ingredients can be placed anywhere)
    else if (recipe.ingredients) {
      formattedRecipe.pattern = this.processShapelessRecipe(recipe.ingredients, formattedRecipe.materials);
    } 
    // Skip unknown recipe types
    else {
      return null;
    }

    return formattedRecipe;
  }

  /**
   * Process a shaped recipe (one with a specific pattern)
   * @param {Array} inShape - The crafting pattern array
   * @param {Array} materials - Materials array to populate
   * @returns {Array} - 3x3 pattern array
   */
  processShapedRecipe(inShape, materials) {
    // Create empty 3x3 pattern
    const pattern = [
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ];

    // Map ingredients to pattern
    inShape.forEach((row, rowIndex) => {
      row.forEach((ingredientId, colIndex) => {
        if (ingredientId) {
          const ingredient = this.mcData.items[ingredientId];
          
          if (ingredient) {
            pattern[rowIndex][colIndex] = {
              id: ingredientId,
              name: ingredient.name,
              displayName: ingredient.displayName || ingredient.name,
              textureFile: this.getTextureFilename(ingredient.name)
            };

            // Add to materials list if not already included
            this.addMaterial(materials, ingredientId, this.countIngredient(inShape, ingredientId));
          }
        }
      });
    });

    return pattern;
  }

  /**
   * Process a shapeless recipe (ingredients with no specific pattern)
   * @param {Array} ingredients - List of ingredients
   * @param {Array} materials - Materials array to populate
   * @returns {Array} - 3x3 pattern array (arranged in rows)
   */
  processShapelessRecipe(ingredients, materials) {
    // Create empty 3x3 pattern
    const pattern = [
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ];

    // Count ingredient occurrences
    const counts = {};
    ingredients.forEach(id => {
      counts[id] = (counts[id] || 0) + 1;
    });

    // Create a materials entry for each ingredient
    Object.entries(counts).forEach(([id, count]) => {
      const numericId = parseInt(id, 10);
      const ingredient = this.mcData.items[numericId];
      
      if (ingredient) {
        this.addMaterial(materials, numericId, count);
      }
    });

    // Arrange ingredients in a grid (for display purposes)
    let row = 0, col = 0;
    ingredients.forEach(ingredientId => {
      if (ingredientId) {
        const ingredient = this.mcData.items[ingredientId];
        
        if (ingredient) {
          pattern[row][col] = {
            id: ingredientId,
            name: ingredient.name,
            displayName: ingredient.displayName || ingredient.name,
            textureFile: this.getTextureFilename(ingredient.name)
          };

          // Move to next position
          col++;
          if (col > 2) {
            col = 0;
            row++;
            if (row > 2) {
              // More than 9 ingredients? This shouldn't happen in vanilla Minecraft
              console.warn(`Shapeless recipe has more than 9 ingredients: ${ingredient.name}`);
            }
          }
        }
      }
    });

    return pattern;
  }

  /**
   * Add a material to the materials list
   * @param {Array} materials - The materials array to modify
   * @param {number} id - Item ID
   * @param {number} count - Number required
   */
  addMaterial(materials, id, count) {
    // Check if we already have this material
    const existingIndex = materials.findIndex(m => m.id === id);
    
    if (existingIndex >= 0) {
      materials[existingIndex].count = count;
    } else {
      const item = this.mcData.items[id];
      if (item) {
        materials.push({
          id: id,
          name: item.name,
          displayName: item.displayName || item.name,
          count: count,
          textureFile: this.getTextureFilename(item.name)
        });
      }
    }
  }

  /**
   * Count occurrences of an ingredient in a recipe shape
   * @param {Array} inShape - The crafting pattern array
   * @param {number} ingredientId - Item ID to count
   * @returns {number} - Count of the ingredient
   */
  countIngredient(inShape, ingredientId) {
    let count = 0;
    inShape.forEach(row => {
      row.forEach(id => {
        if (id === ingredientId) count++;
      });
    });
    return count;
  }

  /**
   * Generate a description for an item based on its properties
   * @param {Object} item - Minecraft item
   * @returns {string} - Description
   */
  generateDescription(item) {
    // This would ideally be expanded with more detailed descriptions
    // You could integrate with the Minecraft Wiki API to get real descriptions
    const name = item.name.toLowerCase();
    
    if (name.includes('pickaxe')) {
      const material = name.split('_')[0];
      return `A ${material} pickaxe is used for mining stone, ores, and mineral blocks. Higher tier materials mine faster and can mine rarer ores.`;
    } else if (name.includes('axe') && !name.includes('pickaxe')) {
      const material = name.split('_')[0];
      return `A ${material} axe is best for chopping wood, but can also serve as a weapon. Higher tier materials cut faster and deal more damage.`;
    } else if (name.includes('sword')) {
      const material = name.split('_')[0];
      return `A ${material} sword is a melee weapon for combat. Higher tier materials deal more damage and have higher durability.`;
    } else if (name.includes('shovel')) {
      const material = name.split('_')[0];
      return `A ${material} shovel is used for digging dirt, sand, gravel, and snow. Higher tier materials dig faster and have higher durability.`;
    } else if (name.includes('crafting_table')) {
      return `The crafting table provides a 3x3 crafting grid, allowing crafting of more complex items than the 2x2 inventory grid.`;
    } else if (name.includes('furnace')) {
      return `A furnace is used to smelt ores, cook food, and process various materials using fuel such as coal or wood.`;
    } else if (name.includes('chest')) {
      return `Chests are storage containers that can hold up to 27 stacks of items. They can be placed next to each other to create a double chest.`;
    }
    
    // Generic description fallback
    return `${item.displayName || item.name} is a craftable item in Minecraft.`;
  }

  /**
   * Get texture URL for an item
   * @param {Object|string|number} item - Item object, ID, or name
   * @returns {string} - URL to texture image
   */
  getItemTextureUrl(item) {
    // If item is an ID, get the item object
    if (typeof item === 'number' || /^\d+$/.test(item)) {
      const id = parseInt(item, 10);
      item = this.items[id];
    }
    
    // If item is a string (name), find the item object
    else if (typeof item === 'string') {
      const lowercaseName = item.toLowerCase();
      item = Object.values(this.items).find(i => 
        i.name.toLowerCase() === lowercaseName || 
        i.displayName.toLowerCase() === lowercaseName
      );
    }
    
    // If we have a valid item object, get its texture
    if (item && item.name) {
      return imageService.getItemTextureUrl(item.name);
    }
    
    // Fallback
    return imageService.getDefaultTextureUrl();
  }

  /**
   * Get all recipes
   * @returns {Array} - All recipes
   */
  getAllRecipes() {
    if (!this.initialized) {
      console.warn('MinecraftDataService not initialized! Call initialize() first.');
      return [];
    }
    return this.recipes;
  }

  /**
   * Search for recipes by name or materials
   * @param {string} query - Search term
   * @returns {Array} - Matching recipes
   */
  searchRecipes(query) {
    if (!this.initialized) {
      console.warn('MinecraftDataService not initialized! Call initialize() first.');
      return [];
    }

    const lowercaseQuery = query.toLowerCase();
    return this.recipes.filter(recipe => 
      recipe.name.toLowerCase().includes(lowercaseQuery) ||
      recipe.materials.some(material => 
        material.name.toLowerCase().includes(lowercaseQuery) ||
        material.displayName.toLowerCase().includes(lowercaseQuery)
      )
    );
  }

  /**
   * Get recipes by category
   * @param {string} category - Category name
   * @returns {Array} - Recipes in the category
   */
  getRecipesByCategory(category) {
    if (!this.initialized) {
      console.warn('MinecraftDataService not initialized! Call initialize() first.');
      return [];
    }

    if (this.categories[category]) {
      return this.categories[category];
    }
    return [];
  }

  /**
   * Get all recipe categories
   * @returns {Object} - Categories and counts
   */
  getCategories() {
    if (!this.initialized) {
      console.warn('MinecraftDataService not initialized! Call initialize() first.');
      return {};
    }

    const result = {};
    Object.entries(this.categories).forEach(([category, recipes]) => {
      result[category] = recipes.length;
    });
    return result;
  }

  /**
   * Get a specific recipe by ID
   * @param {string} id - Recipe ID
   * @returns {Object|null} - Recipe or null if not found
   */
  getRecipeById(id) {
    if (!this.initialized) {
      console.warn('MinecraftDataService not initialized! Call initialize() first.');
      return null;
    }
    return this.recipes.find(recipe => recipe.id === id) || null;
  }

  /**
   * Get recipes that use a specific material
   * @param {string|number} materialIdOrName - Material ID or name
   * @returns {Array} - Recipes using the material
   */
  getRecipesByMaterial(materialIdOrName) {
    if (!this.initialized) {
      console.warn('MinecraftDataService not initialized! Call initialize() first.');
      return [];
    }

    // Handle both IDs and names
    if (typeof materialIdOrName === 'number' || /^[0-9]+$/.test(materialIdOrName)) {
      const id = parseInt(materialIdOrName, 10);
      return this.recipes.filter(recipe => 
        recipe.materials.some(material => material.id === id)
      );
    } else {
      const lowercaseName = materialIdOrName.toLowerCase();
      return this.recipes.filter(recipe => 
        recipe.materials.some(material => 
          material.name.toLowerCase().includes(lowercaseName) ||
          material.displayName.toLowerCase().includes(lowercaseName)
        )
      );
    }
  }

  /**
   * Get details about a specific item
   * @param {string|number} itemIdOrName - Item ID or name
   * @returns {Object|null} - Item or null if not found
   */
  getItem(itemIdOrName) {
    if (!this.initialized) {
      console.warn('MinecraftDataService not initialized! Call initialize() first.');
      return null;
    }

    // Handle ID lookup
    if (typeof itemIdOrName === 'number' || /^[0-9]+$/.test(itemIdOrName)) {
      const id = parseInt(itemIdOrName, 10);
      return this.items[id] || null;
    }
    
    // Handle name lookup
    const lowercaseName = itemIdOrName.toLowerCase();
    return Object.values(this.items).find(item => 
      item.name.toLowerCase() === lowercaseName ||
      item.displayName.toLowerCase() === lowercaseName
    ) || null;
  }

  /**
   * Get supported Minecraft versions
   * @returns {Array} - List of supported versions
   */
  getSupportedVersions() {
    return minecraftData.supportedVersions.full;
  }

  /**
   * Get the current Minecraft version
   * @returns {string} - Current version
   */
  getCurrentVersion() {
    return this.version;
  }
}

// Create and export singleton instance
const minecraftDataService = new MinecraftDataService();
export default minecraftDataService;