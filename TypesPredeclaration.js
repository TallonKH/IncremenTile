let activeColor = "#88ccff";
let inactiveColor = "#4444aa";
let fillColorAlpha = "#bb6622";
let lineColorAlpha = "#441100";
let fillColorBeta = "#5ebb22";
let lineColorBeta = "#2b6e00";
let fillColorGamma = "#5ebb22";
let lineColorGamma = "#2b6e00";
let fillColorOmega = "#000000";
let lineColorOmega = "#ffffff";

let mat_bit_alpha = new Material("bit_alpha", "Alpha Bits", fillColorAlpha, lineColorAlpha);
let mat_gen_alpha = new Material("gen_alpha", "Alpha Generator", fillColorAlpha, lineColorAlpha);
let mat_pulser_alpha = new Material("pulser_alpha", "Alpha Pulser", fillColorAlpha, lineColorAlpha);
let mat_timer_alpha = new Material("timer_alpha", "Alpha Timer", fillColorAlpha, lineColorAlpha);
let mat_multiplier_alpha = new Material("multiplier_alpha", "Alpha Multiplier", fillColorAlpha, lineColorAlpha);
let mat_bit_beta = new Material("bit_beta", "Beta Bits", fillColorBeta, lineColorBeta);

let tile_empty = new TileType("empty");
let tile_gen_alpha = new TileType("gen_alpha");
let tile_pulser_alpha = new TileType("pulser_alpha");
let tile_timer_alpha = new TileType("timer_alpha");
let tile_multiplier_alpha = new TileType("multiplier_alpha");
