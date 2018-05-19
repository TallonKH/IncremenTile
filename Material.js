class Material {
	constructor(name, displayName, primary, secondary) {
		this.name = name;
		this.displayName = displayName;
		this.counter = 0;
		this.usedCounter = 0;
		this.producedCounter = 0;
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

		this.hasPanel = false;
		this.unlocked = false;
		this.unhidden = false;
		this.unlockPercentage = 0.75;
		this.unhidePercentage = 0.25;

		this.panelDiv = null;
		this.titleDiv = null;
		this.detailDiv = null;
		this.buttonDiv = null;
		this.statsDiv = null;
		this.buttons = {};
	}

	updateStats() {
		if (this.unlocked) {
			let str = "<b>Stats</b>";
			str += "<br /><font class=\"mono\" color=\'#149d19\'> + " + (this.genPerSecCounter / 2) + " per second</font>";
			str += "<br /><font class=\"mono\" color=\'#b60f0f\'> - " + (this.usePerSecCounter / 2) + " per second</font>";
			str += "<br /><font class=\"mono\" color=\'#08638a\'> ∑ " + (this.producedCounter) + "</font>";
			this.genPerSecCounter = 0;
			this.usePerSecCounter = 0;
			this.statsDiv.innerHTML = str;
		}
	}

	increment(count) {
		this.setCounter(this.counter + count);
		this.genPerSecCounter += count;
	}

	decrement(count) {
		this.setCounter(this.counter - count);
		this.usePerSecCounter += count;
	}

	unplace() {
		this.usedCounter--;
		this.increment(1);
	}

	setCounter(count) {
		this.counter = count;

		if (this.consumable) {
			this.titleDiv.innerHTML = this.displayName + " : " + count + " : " + this.usedCounter;
		} else {
			this.titleDiv.innerHTML = this.displayName + " : " + count;
		}
	}

	createPanel(tagNew) {
		if (!this.hasPanel) {
			// create new mat panel and append to the list
			this.titleDiv = document.createElement("button"); {
				this.titleDiv.className = "accordion mat-abutton";
				this.titleDiv.setAttribute("style",
					"background-color: " + this.primaryColor + "; " +
					"border-color: " + this.secondaryColor + "; " +
					"color: " + this.secondaryColor);
				this.titleDiv.innerHTML = this.displayName + " : " + this.counter;
				addAccordionLogic($(this.titleDiv));
			}

			this.buttonDiv = document.createElement("div"); {
				this.buttonDiv.className = "mat-buttons";
				if (this.unlocked) {
					let buttons = 0;
					if (this.craftable) {
						let button = document.createElement("button");
						button.className = "mat-button button-craft";
						button.addEventListener("click", this.generateCraftFunction());
						button.innerHTML = "CRAFT";
						this.buttons["craft"] = button;
						this.buttonDiv.append(button);
						buttons++;
					}
					if (this.consumable) {
						let button = document.createElement("button");
						button.className = "mat-button button-consume";
						button.addEventListener("click", this.generateConsumeFunction());
						button.innerHTML = "USE";
						this.buttons["consume"] = button;
						this.buttonDiv.append(button);
						buttons++;
					}

					if(buttons){
						this.buttonDiv.append(document.createElement("br"));
					}
				}
			}

			this.detailDiv = document.createElement("div"); {
				this.detailDiv.className = "mat-details";
			}

			this.statsDiv = document.createElement("div"); {
				this.statsDiv.className = "mat-stats";
				this.statsDiv.append(document.createElement("br"));
			}

			let accordionPane = document.createElement("div"); {
				accordionPane.className = "accordion-pane mat-apane";
				accordionPane.append(this.buttonDiv);
				accordionPane.append(this.detailDiv);
				accordionPane.append(this.statsDiv);
			}

			this.panelDiv = document.createElement("div"); {
				this.panelDiv.className = "material-pane info-pane";
				this.panelDiv.id = this.name;
				this.panelDiv.append(this.titleDiv);
				this.panelDiv.append(accordionPane);
			}

			matListDiv.append(this.panelDiv);
		}
		this.hasPanel = true;
		if (tagNew) {
			tagAsNew(this.titleDiv);
		}
		
		this.updateDetails();
		this.updateStats();
	}

	createMysteryPanel() {
		this.titleDiv = document.createElement("button"); {
			this.titleDiv.className = "accordion mat-abutton";
			this.titleDiv.setAttribute("style",
				"background-color: #aaaaaa" + "; " +
				"border-color: #888888" + "; " +
				"color: #666");
			this.titleDiv.innerHTML = "????";
			tagAsNew(this.titleDiv);
			addAccordionLogic($(this.titleDiv));
		}
		this.detailDiv = document.createElement("div"); {
			this.detailDiv.className = "mat-details";
		}
		let accordionPane = document.createElement("div"); {
			accordionPane.className = "accordion-pane mat-apane";
			accordionPane.append(this.detailDiv);
		}
		this.panelDiv = document.createElement("div"); {
			this.panelDiv.className = "material-pane info-pane";
			this.panelDiv.id = this.name;
			this.panelDiv.append(this.titleDiv);
			this.panelDiv.append(accordionPane);
		}
		matListDiv.append(this.panelDiv);
		this.hasPanel = true;
	}

	updateDivRefs() {
		// this.panelDiv = getChildDivById(matListDiv, this.name);
		// this.titleDiv = getChildDivByClass(this.panelDiv, "accordion mat-abutton");
		// let accordionPane = getChildDivByClass(this.panelDiv, "accordion-pane mat-apane")
		// this.detailDiv = getChildDivByClass(accordionPane, "mat-details");
		// this.buttonDiv = getChildDivByClass(accordionPane, "mat-buttons");
		// this.statsDiv = getChildDivByClass(accordionPane, "mat-stats");
		// this.generateButtons();
		// this.titleDiv
	}

	updateAllDetails() {
		for (var i = 0; i < matList.length; i++) {
			let mat = matList[i];
			if (mat.hasPanel) {
				mat.updateDetails();
			}
		}
	}

	updateDetails() {
		this.detailDiv.innerHTML = this.generateUnlockProgressBars() + this.generateCraftProgressBars();
		if (this.unlocked) {
			if (this.craftable) {
				$(this.buttonDiv).find(".button-craft").attr('useable', this.hasSufficientMaterials());
			}
			if (this.consumable) {
				$(this.buttonDiv).find(".button-consume").attr("useable", this.counter > 0);
			}
		}
	}

	hasSufficientMaterials() {
		if (!this.craftable) {
			return false;
		}

		for (var i = 0; i < this.recipe.length; i++) {
			let req = this.recipe[i];
			if (req[0].counter < req[3]) {
				return false;
			}
		}
		return true;
	}

	generateUnlockProgressBars() {
		if (!this.unlocked) {
			let divs = "<b>UNLOCK</b>" +
			"<br />" +
			"<div style=\"margin-left: 5px;\">";
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

	generateCraftFunction() {
		let mat = this;
		return function() {
			if (mat.hasSufficientMaterials()) {
				for (let i = 0; i < mat.recipe.length; i++) {
					let req = mat.recipe[i];
					req[0].decrement(req[3]);
					req[3] = Math.ceil(req[1] * Math.pow(req[2], 1 + mat.usedCounter + mat.counter));
				}
				mat.producedCounter += 1
				mat.increment(1);
			}
		}
	}

	generateConsumeFunction() {
		let mat = this;
		return function() {
			if (mat.counter > 0) {
				if (mat.consumeAction()) {
					mat.usedCounter++;
					mat.decrement(1);
				}
			}
		}
	}

	generateCraftProgressBars() {
		if (this.unlocked && this.recipe.length > 0) {
			let divs = "<div style=\"margin-left: 5px;\">";
			for (var i = 0; i < this.recipe.length; i++) {
				let req = this.recipe[i];
				let mat = req[0];
				let max = req[3];
				if (this.unlocked) {
					divs += mat.counter + "/" + max + " " + mat.displayName +
						": <progress value=\"" + mat.counter + "\" max=\"" + max + "\"></progress><br />";
				} else {
					divs += mat.counter + "/?? " + mat.displayName + "<br />";
				}
			}
			return divs + "</div>";
		}
		return "";
	}

	defaultPlacementFunction() {
		if (placing) {
			return false;
		}
		placing = this.associatedTile;
		return true;
	}
}