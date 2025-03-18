// src/services/ImageService.js

/**
 * Service for handling Minecraft item/block textures
 */
class ImageService {
    constructor() {
      this.textureBasePath = '/assets/textures';
      
      // Mapping between item names and texture locations (item/ or block/)
      this.textureLocationMap = {
        // If not specified, default is to look in item/ first, then block/
        'cobblestone': 'block', 
        'stone': 'block',
        'oak_planks': 'block',
        'spruce_planks': 'block',
        'birch_planks': 'block',
        'jungle_planks': 'block',
        'acacia_planks': 'block',
        'dark_oak_planks': 'block',
        'crimson_planks': 'block',
        'warped_planks': 'block',
        'dirt': 'block',
        'crafting_table': 'block',
        'furnace': 'block',
        'chest': 'block',
        'bookshelf': 'block',
        'tnt': 'block',
        'redstone_lamp': 'block',
        'piston': 'block',
        'sticky_piston': 'block',
        'observer': 'block',
        'dispenser': 'block',
        'dropper': 'block',
        'daylight_detector': 'block',
        'hopper': 'block',
        'rail': 'block',
        'powered_rail': 'block',
        'detector_rail': 'block',
        'activator_rail': 'block',
      };
      
      // Special case texture name mappings
      this.textureNameMap = {
        'wooden_pickaxe': 'wood_pickaxe',
        'wooden_axe': 'wood_axe',
        'wooden_sword': 'wood_sword',
        'wooden_shovel': 'wood_shovel',
        'wooden_hoe': 'wood_hoe',
        'golden_pickaxe': 'gold_pickaxe',
        'golden_axe': 'gold_axe',
        'golden_sword': 'gold_sword',
        'golden_shovel': 'gold_shovel',
        'golden_hoe': 'gold_hoe',
        'redstone': 'redstone_dust',
        'crafting_table': 'crafting_table_top',
        'furnace': 'furnace_front',
        'chest': 'chest_front',
      };
    }
  
    /**
     * Get the URL for an item's texture
     * @param {string|Object} item - Item name or object with name property
     * @returns {string} - URL to the texture image
     */
    getItemTextureUrl(item) {
      if (!item) return this.getDefaultTextureUrl();
      
      const itemName = typeof item === 'string' ? item : (item.name || item.displayName);
      if (!itemName) return this.getDefaultTextureUrl();
      
      const normalizedName = itemName.toLowerCase().replace(/\s+/g, '_');
      
      // Check for special texture name mapping
      const textureName = this.textureNameMap[normalizedName] || normalizedName;
      
      // Determine the texture location (item or block directory)
      const location = this.textureLocationMap[normalizedName] || 'item';
      
      // Try the mapped location first
      const primaryPath = `${this.textureBasePath}/${location}/${textureName}.png`;
      
      // Use the alternative location as fallback
      const secondaryPath = location === 'item' 
        ? `${this.textureBasePath}/block/${textureName}.png`
        : `${this.textureBasePath}/item/${textureName}.png`;
      
      // Return the best path - in a real implementation, you would check if the file exists
      // For now, we'll just return the primary path and let the HTML img element handle the error
      return primaryPath;
    }
  
    /**
     * Get a URL for a block texture
     * @param {string} blockName - Block name
     * @returns {string} - URL to the texture image
     */
    getBlockTextureUrl(blockName) {
      if (!blockName) return this.getDefaultTextureUrl();
      const normalizedName = blockName.toLowerCase().replace(/\s+/g, '_');
      
      // Check for special texture name mapping
      const textureName = this.textureNameMap[normalizedName] || normalizedName;
      
      return `${this.textureBasePath}/block/${textureName}.png`;
    }
  
    /**
     * Get default texture URL
     * @returns {string} - URL to the default/missing texture
     */
    getDefaultTextureUrl() {
      return `${this.textureBasePath}/missing_texture.png`;
    }
  
    /**
     * Check if a texture exists 
     * @param {string} path - Path to check
     * @returns {Promise<boolean>} - Whether the texture exists
     */
    async textureExists(path) {
      try {
        const response = await fetch(path, { method: 'HEAD' });
        return response.ok;
      } catch (error) {
        return false;
      }
    }
  }
  
  // Create and export singleton instance
  const imageService = new ImageService();
  export default imageService;