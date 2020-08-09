import PlayerSelectDialog from "../item/player-select-dialog.js";
import * as cardhelper from "../item/cardhelper.js";

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class CastleFalkensteinFortuneDeckSheet extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["castlefalkenstein", "sheet", "item", "fortunedeck"],
      width: 520,
      height: 480,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  /** @override */
  get template() {
    const path = "systems/castlefalkenstein/templates/item";
    // Return a single sheet for all item types.
    return `${path}/fortunedeck-sheet.html`;
    // Alternatively, you could use the following return statement to do a
    // unique item sheet by type, like `weapon-sheet.html`.

    // return `${path}/${this.item.data.type}-sheet.html`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData();
    return data;
  }

  /* -------------------------------------------- */

  /** @override */
  setPosition(options = {}) {
    const position = super.setPosition(options);
    const sheetBody = this.element.find(".sheet-body");
    const bodyHeight = position.height - 192;
    sheetBody.css("height", bodyHeight);
    return position;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

	html.find('.rollable').click(this._onRoll.bind(this));

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Roll handlers, click handlers, etc. would go here.
  }
  
  initialize()
  {

	cardhelper.emptyPlayerDecks();		
	
	var mainDeck = cardhelper.createDeck();
	this.updateCardsAsync(mainDeck);
  }

  createMainDeckWithoutPlayerCards()
  {
	var mainDeck = cardhelper.createDeckWithoutPlayerCards();
	 
	this.updateCardsAsync(mainDeck);
  }	 	
  
  updateCardsAsync(cards) {
	  (async () => {
			await this.updateCards(cards);
		 })();
  }
    
  async updateCards(cards)
  {
	await this.item.update( { "data.cards" : cards } );
	await this.item.update( { "data.description" : cards.map(c => c.name).join("<br/>") } );
  }

  
  _onRoll(event) {
	  event.preventDefault();
	  const element = event.currentTarget;
	  const dataset = element.dataset;
	  
	  if (element.id === "initialize")
	  {
		  this.initialize();
		  return;		  
	  }
	  
	  if (element.id === "dealcard") 
	  {
		  (async () => {
			await this.choosePlayerAndDeal();
		 })();
		  
		  return;
	  }	  
	  
	  if (element.id === "dealcardfirst") 
	  {
		  (async () => {
			await this.dealToFirstPlayer();
		 })();
		  
		  return;
	  }	  
	  
	  if (element.id === "dealcardall") 
	  {
		  (async () => {
			await this.dealCardsToAllPlayers();
		 })();
		  
		  return;
	  }	  
	  
	  if (element.id === "initializemaindeck") {
		  this.createMainDeckWithoutPlayerCards();
		  return;
		}
	  
	  console.error("Unhandled event in maindeck-sheet.js: %s", event);	  
	}
	
	async dealToFirstPlayer()
	{		
		var players = cardhelper.getPlayers();
		var player = players[0];
		
		var deck = this.item.data.data.cards;
		
		await cardhelper.dealCardsToPlayer(deck, player);
		this.updateCardsAsync(deck);
		
	}
	
	async choosePlayerAndDeal()
	{
		const usage = await PlayerSelectDialog.create(this);
		var chosenPlayerName = usage.get("currentPlayerName");
		
		var players = cardhelper.getPlayers();
		players.forEach( (p) => {
			
			if (p.name == chosenPlayerName) 
			{
				var deck = this.item.data.data.cards;
				cardhelper.dealCardsToPlayer(deck, p);
				this.updateCardsAsync(deck);
			}
			
		} );		
	}
	
	
	async dealCardsToAllPlayers() {
		
	  var players = cardhelper.getPlayers();
	  
	  var i;
		for (i = 0; i < players.length; i++) {
			var deck = this.item.data.data.cards;
			await cardhelper.dealCardsToPlayer(deck, players[i]) ;
			this.updateCardsAsync(deck);
		} 	  
	}

	getPlayerDecks() {
	  var allItems = game.items;
	  var playerdecks = [];
	  
	  allItems.forEach( (value, key) => {
		  if (value.type === "playerdeck")
			{
				playerdecks.push(value);
			}
	  });
	  
	 return playerdecks;
  }
	  
}
