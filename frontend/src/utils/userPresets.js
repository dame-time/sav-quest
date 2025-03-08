import userPresets from "../data/userPresets.json";

/**
 * Get a random user preset from the available presets
 * @returns {Object} A randomly selected user preset
 */
export const getRandomUserPreset = () => {
  const randomIndex = Math.floor(Math.random() * userPresets.length);
  return userPresets[randomIndex];
};

/**
 * Get a specific user preset by ID
 * @param {string} presetId - The ID of the preset to retrieve
 * @returns {Object|null} The requested preset or null if not found
 */
export const getUserPresetById = (presetId) => {
  return userPresets.find((preset) => preset.id === presetId) || null;
};

/**
 * Get all available user presets
 * @returns {Array} All user presets
 */
export const getAllUserPresets = () => {
  return userPresets;
};

/**
 * Get a preset that focuses on a specific trait
 * @param {string} traitName - The name of the trait to focus on (saver, investor, planner, knowledgeable)
 * @returns {Object} A preset that focuses on the specified trait
 */
export const getPresetByFocus = (traitName) => {
  let focusedPreset;

  switch (traitName) {
    case "saver":
      focusedPreset = getUserPresetById("saver_focused");
      break;
    case "investor":
      focusedPreset = getUserPresetById("investor_focused");
      break;
    case "planner":
      focusedPreset = getUserPresetById("planner_focused");
      break;
    case "knowledgeable":
      focusedPreset = getUserPresetById("knowledge_focused");
      break;
    default:
      focusedPreset = getUserPresetById("balanced");
  }

  return focusedPreset || getRandomUserPreset();
};
