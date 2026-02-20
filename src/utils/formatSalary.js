/**
 * Safely format salary for display.
 * Handles both old string format ("₹25,000 - ₹40,000")
 * and new object format ({ fixed, min, max, commission, incentives }).
 *
 * @param {string|object} salary
 * @param {string} fallback - Default text if salary is empty
 * @returns {string}
 */
export const formatSalary = (salary, fallback = "Best in Industry") => {
    if (!salary) return fallback;

    // Old format: plain string
    if (typeof salary === "string") return salary;

    // New format: object
    if (typeof salary === "object") {
        const parts = [];

        // Fixed salary
        if (salary.fixed) {
            parts.push(`₹${salary.fixed}`);
        }

        // Min-Max range
        if (salary.min && salary.max) {
            parts.push(`₹${salary.min} - ₹${salary.max}`);
        } else if (salary.min) {
            parts.push(`Min ₹${salary.min}`);
        } else if (salary.max) {
            parts.push(`Max ₹${salary.max}`);
        }

        // Commission
        if (salary.commission) {
            parts.push(`+ ${salary.commission} Commission`);
        }

        // Incentives
        if (salary.incentives) {
            parts.push(`+ Incentives`);
        }

        return parts.length > 0 ? parts.join(" | ") : fallback;
    }

    return fallback;
};

export default formatSalary;
