let activeColor = "#88ccff";
let inactiveColor = "#4444aa";
let fillColorAlpha = "#bb6622";
let lineColorAlpha = "#441100";
let fillColorBeta = "#5ebb22";
let lineColorBeta = "#2b6e00";

let mat_bit_alpha = new Material("bit_alpha", "Alpha Bits", fillColorAlpha, lineColorAlpha);
let mat_gen_alpha = new Material("gen_alpha", "Alpha Generator", fillColorAlpha, lineColorAlpha);
let mat_pulser_alpha = new Material("pulser_alpha", "Alpha Pulser", fillColorAlpha, lineColorAlpha);
let mat_bit_beta = new Material("bit_beta", "Beta Bits", fillColorBeta, lineColorBeta);

let tile_empty = new TileType("empty");
let tile_gen_alpha = new TileType("gen_alpha");
let tile_pulser_alpha = new TileType("pulser_alpha");
