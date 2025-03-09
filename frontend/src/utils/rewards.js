/**
 * Rewards and progression utility functions
 */

/**
 * Calculate coins earned when leveling up
 * Formula: 50 coins base + (level * 25)
 * @param {number} level - The level the user is reaching
 * @returns {number} - Coins earned for this level
 */
export const getCoinsForLevel = (level) => {
    const baseCoins = 50;
    const levelMultiplier = 25;
    return baseCoins + (level * levelMultiplier);
};

/**
 * Get the XP required to reach the next level
 * Formula: 100 + (level * 50)
 * @param {number} currentLevel - The user's current level
 * @returns {number} - XP required for next level
 */
export const getXpRequiredForNextLevel = (currentLevel) => {
    const baseXp = 100;
    const levelMultiplier = 50;
    return baseXp + (currentLevel * levelMultiplier);
};

/**
 * Get tier information based on user level
 * @param {number} level - The user's current level
 * @returns {object} - Tier information
 */
export const getUserTierByLevel = (level) => {
    if (level >= 16) {
        return {
            id: "platinum",
            name: "Platinum",
            levelRange: "16+",
            color: "text-cyan-400",
            bgColor: "bg-cyan-500/20",
            borderColor: "border-cyan-400"
        };
    } else if (level >= 11) {
        return {
            id: "gold",
            name: "Gold",
            levelRange: "11-15",
            color: "text-yellow-400",
            bgColor: "bg-yellow-500/20",
            borderColor: "border-yellow-400"
        };
    } else if (level >= 6) {
        return {
            id: "silver",
            name: "Silver",
            levelRange: "6-10",
            color: "text-gray-400",
            bgColor: "bg-gray-500/20",
            borderColor: "border-gray-400"
        };
    } else {
        return {
            id: "bronze",
            name: "Bronze",
            levelRange: "1-5",
            color: "text-amber-600",
            bgColor: "bg-amber-900/20",
            borderColor: "border-amber-600"
        };
    }
};

/**
 * Get total coins earned from level 1 to current level
 * @param {number} currentLevel - The user's current level
 * @returns {number} - Total coins earned from leveling up
 */
export const getTotalCoinsFromLevels = (currentLevel) => {
    let totalCoins = 0;
    for (let i = 1; i <= currentLevel; i++) {
        totalCoins += getCoinsForLevel(i);
    }
    return totalCoins;
}; 