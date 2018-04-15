class Material {
	constructor(name, displayName, primary, secondary) {
		this.name = name;
		this.displayName = displayName;
		this.counter = 0;
		this.usedCounter = 0;
		this.primaryColor = primary;
		this.secondaryColor = secondary;
		this.craftable = true;
		this.consumable = true;
		this.recipe = [];
		this.recipesThatNeed = [];
		this.associatedTile = null;
		this.genPerSecCounter = 0;
		this.usePerSecCounter = 0;
		this.consumeAction = Function.prototype;

		this.unlocked = false;
		this.unhidden = false;
		this.unlockPercentage = 0.75;
		this.unhidePercentage = 0.25;

		this.panelDiv = null;
		this.titleDiv = null;
		this.detailsDiv = null;
		this.buttonDiv = null;
		this.statsDiv = null;
	}

	updateStats(){
		if(this.unlocked){
			let str = "<b>Stats</b>";
			str += "<br /><font class=\"mono\" color=\'#149d19\'> + " + (this.genPerSecCounter/2) + " per second</font>";
			str += "<br /><font class=\"mono\" color=\'#b60f0f\'> - " + (this.usePerSecCounter/2) + " per second</font>";

			this.genPerSecCounter = 0;
			this.usePerSecCounter = 0;
			this.statsDiv.innerHTML = str;
		}
	}

	increment(count) {
		this.setCounter(this.counter + count);
		this.genPerSecCounter += count;
	}

	decrement(count){
		this.setCounter(this.counter - count);
		this.usePerSecCounter += count;
	}

	unplace(){
		this.usedCounter--;
		this.increment(1);
	}

	setCounter(count) {
		this.counter = count;

		if(this.consumable){
			this.titleDiv.innerHTML = this.displayName + " : " + count + " : " + this.usedCounter;
		}else{
			this.titleDiv.innerHTML = this.displayName + " : " + count;
		}
	}

	createPanel() {
		let inner =
		"<button class=\"accordion mat-abutton\" new=\"true\" style=\"background-color: " + this.primaryColor + "; border-color: " +
		this.secondaryColor + "; color: " + this.secondaryColor + ";\">" +
			this.displayName + " : " + this.counter +
		"</button><div class=\"accordion-pane mat-apane\"><div class=\"mat-buttons\"></div><div class=\"mat-details\"></div><hr><div class=\"mat-stats\"></div></div>";

		if(this.panelDiv != null){
			this.panelDiv.innerHTML = inner;
		}else{
			matListDiv.innerHTML +=
			"<div class=\"material-pane info-pane\" id=" + this.name + ">" +
			inner +
			"</div>";
		}
		Material.prototype.updateAllDivRefs();
		this.updateDetails();
	}

	createMysteryPanel(){
		matListDiv.innerHTML +=
		"<div class=\"material-pane info-pane\" id=" + this.name + ">" +
			"<button class=\"accordion mat-abutton\" new=\"true\" style=\"background-color: #aaaaaa; border-color: #888888; color: #666666;\">????</button>" +
			"<div class=\"accordion-pane mat-apane\"><div class=\"mat-details\"></div></div>" +
		"</div>";
		Material.prototype.updateAllDivRefs();
	}

	updateAllDivRefs(){
		for (var i = 0; i < matList.length; i++) {
			let mat = matList[i];
			if(mat.unhidden){
				mat.updateDivRefs();
			}
		}
	}

	updateDivRefs(){
		this.panelDiv = getChildDivById(matListDiv, this.name);
		this.titleDiv = getChildDivByClass(this.panelDiv, "accordion mat-abutton");
		let accordionPane = getChildDivByClass(this.panelDiv, "accordion-pane mat-apane")
		this.detailDiv = getChildDivByClass(accordionPane, "mat-details");
		this.buttonDiv = getChildDivByClass(accordionPane, "mat-buttons");
		this.statsDiv = getChildDivByClass(accordionPane, "mat-stats");
		this.generateButtons();
		addAccordionLogic(this.titleDiv);
	}

	updateAllDetails(){
		for (var i = 0; i < matList.length; i++) {
			let mat = matList[i];
			if(mat.unhidden){
				mat.updateDetails();
			}
		}
	}

	updateDetails(){
		this.detailDiv.innerHTML = this.generateUnlockProgressBars() + this.generateCraftProgressBars();
		if(this.unlocked){
			if(this.craftable){
				getChildDivByClass(this.buttonDiv, "mat-button button-craft")
				.setAttribute("useable", this.hasSufficientMaterials());
			}
			if(this.consumable){
				getChildDivByClass(this.buttonDiv, "mat-button button-consume")
				.setAttribute("useable", this.counter > 0);
			}
		}
	}

	hasSufficientMaterials(){
		if(!this.craftable){
			return false;
		}

		for (var i = 0; i < this.recipe.length; i++) {
			let req = this.recipe[i];
			if(req[0].counter < req[3]){
				return false;
			}
		}
		return true;
	}

	generateUnlockProgressBars(){
		if(!this.unlocked){
			let divs = "<b>UNLOCK</b><br /><div style=\"margin-left: 5px;\">";
			for (var i = 0; i < this.recipe.length; i++) {
				let req = this.recipe[i];
				let mat = req[0];
				let max = Math.ceil(this.unlockPercentage * req[1]);
				divs += mat.counter + "/" + max + " " + mat.displayName +
				": <progress value=\"" + mat.counter + "\" max=\"" + max + "\"></progress><br />";
			}
			return divs + "</div>";
		}
		return "";
	}

	generateCraftFunction(){
		let mat = this;
		return function(){
			if(mat.hasSufficientMaterials()){
				for (let i = 0; i < mat.recipe.length; i++) {
					let req = mat.recipe[i];
					req[0].decrement(req[3]);
					req[3] = Math.ceil(req[1] * Math.pow(req[2], 1 + mat.usedCounter + mat.counter));
				}
				mat.increment(1);
			}
		}
	}

	generateConsumeFunction(){
		let mat = this;
		return function(){
			if(mat.counter > 0){
				mat.usedCounter++;
				mat.decrement(1);
				mat.consumeAction();
			}
		}
	}

	generateButtons(){
		if(this.unlocked){
			let div = "";
			let num = 0;
			if(this.craftable){
				num ++;
				div += "<button class=\"mat-button button-craft\">CRAFT</button>";
			}
			if(this.consumable){
				num ++;
				div += "<button class=\"mat-button button-consume\">USE</button>";
			}

			this.buttonDiv.innerHTML = div + (num ? "<br />" : "");

			if(this.craftable){
				getChildDivByClass(this.buttonDiv, "mat-button button-craft")
				.addEventListener("click", this.generateCraftFunction());
			}
			if(this.consumable){
				getChildDivByClass(this.buttonDiv, "mat-button button-consume")
				.addEventListener("click", this.generateConsumeFunction());
			}
		}
	}

	generateCraftProgressBars(){
		if(this.unlocked && this.recipe.length > 0){
			let divs = "<div style=\"margin-left: 5px;\">";
			for (var i = 0; i < this.recipe.length; i++) {
				let req = this.recipe[i];
				let mat = req[0];
				let max = req[3];
				if(this.unlocked){
					divs += mat.counter + "/" + max + " " + mat.displayName +
					": <progress value=\"" + mat.counter + "\" max=\"" + max + "\"></progress><br />";
				}else{
					divs += mat.counter + "/?? " + mat.displayName + "<br />";
				}
			}
			return divs + "</div>";
		}
		return "";
	}

	generateBuildMenu(){

	}
}