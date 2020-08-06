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
	players.forEach( (p) => p.update( { "data.cards" : [] }) );
	
	var mainDeck = this.createDeck();
	this.item.update( { "data.cards" : mainDeck } );
	
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
					name : this.cardName(value, suit)
				};
		return card;
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
		  this.dealCard();
		  return;
	  }	  
	  
	  console.error("Unhandled event in maindeck-sheet.js: %s", event);	  
	}
	
	dealCard() {
		
	  var players = this.getPlayers();
	  var player = players[0];
	  
	  if (!player)
	  {
		  alert("No player");
		  return;
	  }
	  
	  var cards = player.data.data.cards;
	  
	  if (cards.length > 3) 
	  {
		  alert("This deck already has four cards.");
		  return;
	  }
		
	  var deck = this.item.data.data.cards;

	  var card = deck.pop();
	  if (!card) {
		  alert("No card left");
		  return;
	  }
	  
	  cards.push(card);
	  player.update({
		  "data.cards": cards
	  });
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
