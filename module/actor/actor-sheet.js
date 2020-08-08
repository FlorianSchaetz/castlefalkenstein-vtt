/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class CastleFalkensteinActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["castlefalkenstein", "sheet", "actor"],
      template: "systems/castlefalkenstein/templates/actor/actor-sheet.html",
      width: 800,
      height: 800,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" },
			 { navSelector: ".skills-nav", contentSelector: ".skills-body", initial: "skills-spades" }]
    });
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData();
    data.dtypes = ["String", "Number", "Boolean"];
    for (let attr of Object.values(data.data.attributes)) {
      attr.isCheckbox = attr.dtype === "Boolean";
    }
    return data;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);		

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Add Inventory Item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    // Update Inventory Item
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.getOwnedItem(li.data("itemId"));
      item.sheet.render(true);
    });

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      this.actor.deleteOwnedItem(li.data("itemId"));
      li.slideUp(200, () => this.render(false));
    });

    // Rollable abilities.
    html.find('.rollable').click(this._onRoll.bind(this));
  }

  /* -------------------------------------------- */

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      data: data
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.data["type"];

    // Finally, create the item!
    return this.actor.createOwnedItem(itemData);
  }

  findSelectedCards(cards) {
	  var selectedCards = [];
	  if (cards.card0 && cards.card0.selected) {
		  selectedCards.push(cards.card0);
	  }
	  if (cards.card1 && cards.card1.selected) {
		  selectedCards.push(cards.card1);
	  }
	  if (cards.card2 && cards.card2.selected) {
		  selectedCards.push(cards.card2);
	  }
	  if (cards.card3 && cards.card3.selected) {
		  selectedCards.push(cards.card3);
	  }
	  return selectedCards;
  }
  
    removeSelectedCards(cards) {	  
	  if (cards.card0 && cards.card0.selected) {
		  this.actor.update({"-=data.cards.card0" : null });
	  }
	  if (cards.card1 && cards.card1.selected) {
		  this.actor.update({"-=data.cards.card1" : null });
	  }
	  if (cards.card2 && cards.card2.selected) {
		  this.actor.update({"-=data.cards.card2" : null });
	  }
	  if (cards.card3 && cards.card3.selected) {
		  this.actor.update({"-=data.cards.card3" : null });
	  }
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

	  if (element.id.startsWith("skill"))
	  {
		  var skillName = element.id.substring(6);
		  var skill = this.actor.data.data.skills[skillName];
		  
		  var selectedCards = [];
		  var cards = this.actor.data.data.cards;
		  
		  var selectedCards = this.findSelectedCards(cards);

		  const reducer = (accumulator, currentValue) => {
			  if (skill.suit == currentValue.suit) {
				  accumulator = currentValue.value + accumulator;				  
			  }
			  else {
				  accumulator = accumulator+1;
			  }
			  
			  return accumulator;
		  }
		  
		  var result = selectedCards.reduce(reducer, 0) + this.skillToNumber(skill.value);

		  console.log(result);
		  
		  this.removeSelectedCards(cards);
		  
		  return;
	  }
	  


    if (dataset.roll) {
      let roll = new Roll(dataset.roll, this.actor.data.data);
      let label = dataset.label ? `Rolling ${dataset.label}` : '';
      roll.roll().toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label
      });
    }
  }
  
  skillToNumber(skill) {
	  
		var string = "";
        if (skill) {
            string = skill.toUpperCase();
        }

        if (string === "POOR" || string === "PR") {
            return 2;
        }
        if (string === "AVERAGE" || string === "AV") {
            return 4;
        }
        if (string === "GOOD" || string === "GD") {
            return 6;
        }
        if (string === "GREAT" || string === "GR") {
            return 8;
        }
        if (string === "EXCEPTIONAL" || string === "EXC") {
            return 10;
        }
        if (string === "EXTRAORDINARY" || string === "EXT") {
            return 12;
        }

        return 0;
  }

}
