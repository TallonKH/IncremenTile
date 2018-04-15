function generateMaterialTypes(mats) {
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

	mat_timer_alpha.unhidePercentage = 0.25;
	mat_timer_alpha.unlockPercentage = 0.5;
	mat_timer_alpha.recipe = [[mat_bit_alpha, 32, 1.75, 32]];
	mat_timer_alpha.associatedTile = mat_timer_alpha;
	mat_timer_alpha.consumeAction = function(){placing = tile_timer_alpha;}
	mats["timer_alpha"] = (mat_timer_alpha);

	mat_multiplier_alpha.unhidePercentage = 0.25;
	mat_multiplier_alpha.unlockPercentage = 0.5;
	mat_multiplier_alpha.recipe = [[mat_multiplier_alpha, 64, 1.75, 64]];
	mat_multiplier_alpha.associatedTile = mat_multiplier_alpha;
	mat_multiplier_alpha.consumeAction = function(){placing = tile_multiplier_alpha;}
	mats["multiplier_alpha"] = (mat_multiplier_alpha);

	mat_bit_beta.unhidePercentage = 0.125;
	mat_bit_beta.unlockPercentage = 0.5;
	mat_bit_beta.craftable = false;
	mat_bit_beta.consumable = false;
	mat_bit_beta.recipe = [[mat_bit_alpha, 1024, 1, 1024]];
	mats["bit_beta"] = (mat_bit_beta);
}

function interpretRecipes() {
	for (var i = 0; i < materialTypes.length; i++) {
		let mat = mats[i];
		for (var i = 0; i < mat.recipe.length; i++) {
			let ingredient = mat.recipe[i][0];
			ingredient.recipesThatNeed.push(mat);
		}
	}
}
