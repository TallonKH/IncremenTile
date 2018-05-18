function generateMaterialTypes(mats) {
	let mat = mat_bit_alpha;
	mat.unhidePercentage = 0;
	mat.unlockPercentage = 0;
	mat.craftable = true;
	mat.recipe = []
	mat.consumable = false;
	mats["bit_alpha"] = (mat);

	mat = mat_gen_alpha;
	mat.unhidePercentage = 0;
	mat.unlockPercentage = 0.0;
	mat.recipe = [[mat_bit_alpha, 4, 1.2, 4]];
	mat.associatedTile = tile_gen_alpha;
	mat.consumeAction = mat.defaultPlacementFunction;
	mats["gen_alpha"] = (mat);

	mat = mat_pulser_alpha;
	mat.unhidePercentage = 0.25;
	mat.unlockPercentage = 0.5;
	mat.recipe = [[mat_bit_alpha, 32, 1.4, 32]];
	mat.associatedTile = tile_pulser_alpha;
	mat.consumeAction = mat.defaultPlacementFunction;
	mats["pulser_alpha"] = (mat);

	mat = mat_timer_alpha;
	mat.unhidePercentage = 0.25;
	mat.unlockPercentage = 0.5;
	mat.recipe = [[mat_bit_alpha, 32, 1.75, 32]];
	mat.associatedTile = tile_timer_alpha;
	mat.consumeAction = mat.defaultPlacementFunction;
	mats["timer_alpha"] = (mat);

	mat = mat_multiplier_alpha;
	mat.unhidePercentage = 0.25;
	mat.unlockPercentage = 0.5;
	mat.recipe = [[mat_multiplier_alpha, 64, 1.75, 64]];
	mat.associatedTile = tile_multiplier_alpha;
	mat.consumeAction = mat.defaultPlacementFunction;
	mats["multiplier_alpha"] = (mat);

	mat = mat_bit_beta;
	mat.unhidePercentage = 0.125;
	mat.unlockPercentage = 0.5;
	mat.craftable = false;
	mat.consumable = false;
	mat.recipe = [[mat_bit_alpha, 1024, 1, 1024]];
	mats["bit_beta"] = (mat);
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
