TILE TYPES

Generators: add 1 material to chache
 * - have cooldown
 * - TIER: very expensive recipe, function slower, output next tier material, consume 1k of prev material per
 *
 * Multipliers: multiply stats of adjacent tiles
 * : double output count of Generators & halve cooldown
 * : double speed of Timers and also amount of clicks
 * : halve cooldown of Pulsers
 * : halve cooldown of Crafters
 * - do nothing when clicked
 * - can be stacked for maximum x16 per tile
 * - cannot multiply other Multipliers
 * - TIER: higher multiplier
 *
 * Pulsers: activate adjacent / surrounding tiles
 * - can activate adjacent Pulsers
 * - have cooldown
 * - TIER : more range & lower cooldown
 *
 * Timers: every x ticks, activate frontwards tile for a total of y times
 * - allow rotation of timers to be changed
 * - activations should only count if anything was successfully activated
 * - if a timer runs out of clicks, clicking it can reset it
 * - timers can also be reset automatically, but ONLY BY OTHER TIMERS and ONLY FROM BEHIND
 * - - this allows stacking Timers for exponential AFK clicks
 * - - only Timers & only behind prevents looping Timers infinitely
 * - limited clicks forces the player to not cheat via AFKing for extended times
 * - TIER: more clicks & lower cooldown
 *
 * Crafters: required to craft higher-tier tiles
 * - have really long cooldown
 * - TIER: lower cooldown
 */

//BALANCE PHILOSOPHY
/*
 * Every tile type gets increasingly expensive
 * - prevents spamming generators everywhere
 *
 * Destroying/replacing a tile will give back all ingredients
 * - need to account for price increase
 *
 * All cooldowns capped to 1 tick (cannot be 0)
 *
 * 1 kilobit required to craft 1 bit of next tier material
 * - 1 alpha kilobit --> 1 betabit
 *
 * equiv materials of a tile can be used to upgrade it
 * - cannot skip tiers
 * - price increase should be decided by number of upgraded tiles, not base tiles
 *
 * 1 megabit should unlock a new dimension - once per tier
 *
 * Generator consumption allows production of exponentially better stuff without making lower tiers useless
 *
 * Achievement descriptions should be dynamic (hidden, unhidden, near completion, done, etc)
 * Numeric achievements should have a progress bar
 *
 * have a little console that outputs in-depth info about new tiles in ASCII
 *
 * console should output facts about special numbers of alpha bits
 */
//NUMBER IDEAS
/*
 * 1! : 1 bit
 * 2! : 2 bits
 * 3! : 6 bits (it's a factorial, not an exclamation point)
 *
 *
 * 42
 * 22, 333, 4444 ... 999999999
 *
 * 121, 12321, 1234321 ... 12345678987654321
 *
 * 314, 314159, 314159265, ...
 *
 * 10, 100, 1000 ...
 *
 * powers of 2 and 3
 *
 *
 */

//ACHIEVEMENT IDEAS

/*
 * Count to 10! : (it's harder than it looks) : //10! = 3,628,800
 *
 * π²	: have 314 pi bits
 *
 * Aα, Bβ, Γγ ... Ωω : (tier unlocked: alpha, beta, etc)
 */