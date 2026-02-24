/**
 * Claude-specific exports for the Sunpeak simulator.
 *
 * @module sunpeak/claude
 */

// Register Claude host shell (side effect)
import './claude-host';

// Re-export the generic Simulator (Claude shell is registered above)
export { Simulator as ClaudeSimulator } from '../simulator/simulator';
