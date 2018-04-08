function generateMaterialTypes() {
	mats = {};

	mat_bit_alpha.unhidePercentage = 0;
	mat_bit_alpha.unlockPercentage = 0;
	mat_bit_alpha.counter = 4;
	mat_bit_alpha.craftable = false;
	mat_bit_alpha.consumable = false;
	mats["bit_alpha"] = (mat_bit_alpha);

	mat_gen_alpha.unhidePercentage = 0;
	mat_gen_alpha.unlockPercentage = 0.0;
	mat_gen_alpha.recipe = [[mat_bit_alpha, 4, 1.2, 4]];
	mat_gen_alpha.associatedTile = tile_gen_alpha;
	mat_gen_alpha.consumeAction = function(){placing = tile_gen_alpha;}
	mats["gen_alpha"] = (mat_gen_alpha);

	mat_pulser_alpha.unhidePercentage = 0.25;
	mat_pulser_alpha.unlockPercentage = 0.5;
	mat_pulser_alpha.recipe = [[mat_bit_alpha, 32, 1.4, 32]];
	mat_pulser_alpha.associatedTile = mat_pulser_alpha;
	mat_pulser_alpha.consumeAction = function(){placing = tile_pulser_alpha;}
	mats["pulser_alpha"] = (mat_pulser_alpha);

	mat_bit_beta.unhidePercentage = 0.125;
	mat_bit_beta.unlockPercentage = 0.5;
	mat_bit_beta.craftable = false;
	mat_bit_beta.consumable = false;
	mat_bit_beta.recipe = [[mat_bit_alpha, 1024, 1, 1024]];
	mats["bit_beta"] = (mat_bit_beta);

	return mats;
}

function interpretRecipes() {
	for (var i = 0; i < mats.length; i++) {
		let mat = mats[i];
		for (var i = 0; i < mat.recipe.length; i++) {
			let ingredient = mat.recipe[i][0];
			ingredient.recipesThatNeed.push(mat);
		}
	}
}
