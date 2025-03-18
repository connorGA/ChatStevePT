// Sample recipe data for MVP
const recipes = [
    {
      id: 'crafting_table',
      name: 'Crafting Table',
      pattern: [
        ['W', 'W', ' '],
        ['W', 'W', ' '],
        [' ', ' ', ' ']
      ],
      result: 'Crafting Table',
      materials: [
        { item: 'Wood Planks', count: 4 }
      ],
      description: 'A crafting table is used to craft more complex items in Minecraft.'
    },
    {
      id: 'wooden_pickaxe',
      name: 'Wooden Pickaxe',
      pattern: [
        ['W', 'W', 'W'],
        [' ', 'S', ' '],
        [' ', 'S', ' ']
      ],
      result: 'Wooden Pickaxe',
      materials: [
        { item: 'Wood Planks', count: 3 },
        { item: 'Stick', count: 2 }
      ],
      description: 'The wooden pickaxe is the most basic pickaxe, used for mining stone.'
    },
    {
      id: 'furnace',
      name: 'Furnace',
      pattern: [
        ['C', 'C', 'C'],
        ['C', ' ', 'C'],
        ['C', 'C', 'C']
      ],
      result: 'Furnace',
      materials: [
        { item: 'Cobblestone', count: 8 }
      ],
      description: 'A furnace is used to smelt items in Minecraft.'
    },
    {
      id: 'chest',
      name: 'Chest',
      pattern: [
        ['W', 'W', 'W'],
        ['W', ' ', 'W'],
        ['W', 'W', 'W']
      ],
      result: 'Chest',
      materials: [
        { item: 'Wood Planks', count: 8 }
      ],
      description: 'A chest is used to store items in Minecraft.'
    },
    {
      id: 'torch',
      name: 'Torch',
      pattern: [
        [' ', 'C', ' '],
        [' ', 'S', ' '],
        [' ', ' ', ' ']
      ],
      result: 'Torch (4)',
      materials: [
        { item: 'Coal', count: 1 },
        { item: 'Stick', count: 1 }
      ],
      description: 'Torches provide light in dark areas.'
    }
  ];
  
  // Function to get all recipes
  export const getRecipes = () => {
    return recipes;
  };
  
  // Function to search for recipes by name
  export const searchRecipes = (query) => {
    const lowercaseQuery = query.toLowerCase();
    return recipes.filter(recipe => 
      recipe.name.toLowerCase().includes(lowercaseQuery) ||
      recipe.materials.some(material => 
        material.item.toLowerCase().includes(lowercaseQuery)
      )
    );
  };
  
  // Function to get a recipe by ID
  export const getRecipeById = (id) => {
    return recipes.find(recipe => recipe.id === id);
  };
  
  // Function to get recipes by material
  export const getRecipesByMaterial = (material) => {
    const lowercaseMaterial = material.toLowerCase();
    return recipes.filter(recipe => 
      recipe.materials.some(mat => 
        mat.item.toLowerCase().includes(lowercaseMaterial)
      )
    );
  };