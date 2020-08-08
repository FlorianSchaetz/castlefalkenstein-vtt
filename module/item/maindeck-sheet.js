import PlayerSelectDialog from "../item/player-select-dialog.js";

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class CastleFalkensteinMainDeckSheet extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["castlefalkenstein", "sheet", "item", "maindeck"],
      width: 520,
      height: 480,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  /** @override */
  get template() {
    const path = "systems/castlefalkenstein/templates/item";
    // Return a single sheet for all item types.
    return `${path}/maindeck-sheet.html`;
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
	/*var playerdecks = this.getPlayerDecks();
	playerdecks.forEach( (d) => d.update( { "data.cards" : [] }) );*/
	
	var players = this.getPlayers();	
	players.forEach( (p) => p.update( { "-=data.cards.card0" : null } ) );			
	players.forEach( (p) => p.update( { "-=data.cards.card1" : null } ) );			
	players.forEach( (p) => p.update( { "-=data.cards.card2" : null } ) );			
	players.forEach( (p) => p.update( { "-=data.cards.card3" : null } ) );			
	
	var mainDeck = this.createDeck();
	this.item.update( { "data.cards" : mainDeck } );
	
  }
  
  async updatePlayer(player, obj) {
	  player.update(obj);
  }
  
   createDeck()
	{
		var suits = ["spades", "clubs", "hearts", "diamonds"];
		var deck = [];
		for (var s = 0; s < 4; s++) {
			for (var i = 2; i <= 13; i++) {				
				deck.push(this.createCard(i, suits[s]));
			} 	
		} 
		
		deck.push(this.createCard(14, "joker"));
		deck.push(this.createCard(14, "joker"));
		
		this.shuffle(deck);
		return deck;		
	}
	
	createCard(value, suit)
	{
		var card = {					
					suit : suit,
					value : value,
					selected : false,
					name : this.cardName(value, suit),
					filename : this.cardFileName(value, suit)
				};
		return card;
	}
	
	cardFileName(value, suit)
	{
		if (!value)
			return "";
		
		if (value < 11) 
		{	
			return "" + value + "_of_" + suit + ".png";
		}
		
		if (value == 11) 
		{
			return "jack_of_" + suit + ".png";
		}
		
		if (value == 12) 
		{
			return "queen_of_" + suit + ".png";
		}
		
		if (value == 13) 
		{
			return "king_of_" + suit + ".png";
		}
		
		if (value == 14) 
		{
			return "red_joker.png";
		}
		
		return "";
	}
	
	cardName(value, suit)
	{
		if (!value)
			return "";
		
		if (value < 11) 
		{	
			return "" + value + " of " + suit;
		}
		
		if (value == 11) 
		{
			return "Jack of " + suit;
		}
		
		if (value == 12) 
		{
			return "Queen of " + suit;
		}
		
		if (value == 13) 
		{
			return "King of " + suit;
		}
		
		if (value == 14) 
		{
			return "Joker";
		}
		
		return "";
	}
	
	shuffle(array) {
		array.sort(() => Math.random() - 0.5);
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
	  
	  console.error("Unhandled event in maindeck-sheet.js: %s", event);	  
	}

  
	async dealCardToSinglePlayer(player)
	{
		if (!player)
		{
			alert("No player");
			return;
		}	  
		
		var cards = player.data.data.cards;
	  	  
		while(this.hasEmptyField(cards))
		{
			var deck = this.item.data.data.cards;

			var card = deck.pop();
			if (!card) {
				alert("No card left");
				return;
			}

			console.log("Dealt " + card.name + "to " + player.name);
			await this.setCard(player, card);
			
			cards = player.data.data.cards;
		}
	}
	
	async dealToFirstPlayer()
	{
		
		var players = getPlayers();
		var player = players[0];
		
		await this.dealCardToSinglePlayer(player);
		
	}
	
	async choosePlayerAndDeal()
	{
		const usage = await PlayerSelectDialog.create(this);
		var chosenPlayerName = usage.get("currentPlayerName");
		
		var players = this.getPlayers();
		players.forEach( (p) => {
			
			if (p.name == chosenPlayerName) 
			{
				this.dealCardToSinglePlayer(p);
			}
			
		} );		
	}
	
	
	async dealCardsToAllPlayers() {
		
	  var players = this.getPlayers();
	  
	  var i;
		for (i = 0; i < players.length; i++) {
		await this.dealCardToSinglePlayer(players[i]) ;
		} 	  
	}
	
	hasEmptyField(cards) 
	{
		if (cards.card0 && cards.card1 && cards.card2 && cards.card3 ) {
			return false;
		}
		
		return true;
	}
	
	async setCard(player, card) {
		var cards = player.data.data.cards;
		
		if (!cards.card0) {
			await player.update({"data.cards.card0" : card});			
		}
		else if (!cards.card1) {
			await player.update({"data.cards.card1" : card});
		}
		else if (!cards.card2) {
			await player.update({"data.cards.card2" : card});
		}
		else if (!cards.card3) {
			await player.update({"data.cards.card3" : card});
		}
		else {
			console.log("No slots for for" + player.name);
		}
	}	

	getPlayers() 
	{
		var players = [];
		var allActors = ActorDirectory.collection;
		allActors.forEach( (value, key) => {
		  if (value.data.type === "character")
			{
				players.push(value);
		}});
		return players;
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
