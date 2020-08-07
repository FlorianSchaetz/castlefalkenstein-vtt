// Import Modules
import { CastleFalkensteinActor } from "./actor/actor.js";
import { CastleFalkensteinActorSheet } from "./actor/actor-sheet.js";
import { CastleFalkensteinItem } from "./item/item.js";
import { CastleFalkensteinItemSheet } from "./item/item-sheet.js";
import { CastleFalkensteinMainDeckSheet } from "./item/maindeck-sheet.js";

Hooks.once('init', async function () {

    game.castlefalkenstein = {
		decks : {
			fortune : createDeck(),
			sorcery : createDeck()
		}
    };

    Combat.prototype._getInitiativeFormula = function (combatant) {
        const actor = combatant.actor;
        if (!actor)
            return "1d10";
        const init = skillToNumberFunction(actor.data.data.skills.perception.value);
        return "" + init;
    };
	
	/**
		This is currently not synchronized with the clients and only done this way to test the basic idea. 
		
		One of the next steps will be to move this over to an item and/or wait for the actual card deck implementation of Foundry VTT ;-)
	*/
	function createDeck()
	{
		var suits = ["spades", "clubs", "hearts", "diamonds"];
		var deck = [];
		for (var s = 0; s < 4; s++) {
			for (var i = 2; i <= 13; i++) {				
				deck.push(createCard(i, suits[s]));
			} 	
		} 
		
		deck.push(createCard(14, "joker"));
		deck.push(createCard(14, "joker"));
		
		shuffle(deck);
		return deck;		
	}
	
	function createCard(value, suit)
	{
		var card = {					
					suit : suit,
					value : value,
					name : cardName(value, suit)
				};
		return card;
	}
	
	function cardName(value, suit)
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
	
	function shuffle(array) {
		array.sort(() => Math.random() - 0.5);
	}

    // Define custom Entity classes
    CONFIG.Actor.entityClass = CastleFalkensteinActor;
    CONFIG.Item.entityClass = CastleFalkensteinItem;

    // Register sheet application classes
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("castlefalkenstein", CastleFalkensteinActorSheet, { makeDefault: true});
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("castlefalkenstein", CastleFalkensteinItemSheet, { types: ["item"], makeDefault: true });
	Items.registerSheet("castlefalkenstein", CastleFalkensteinMainDeckSheet, { types: ["maindeck"], makeDefault: false });

    // If you need to add Handlebars helpers, here are a few useful examples:
    Handlebars.registerHelper('concat', function () {
        var outStr = '';
        for (var arg in arguments) {
            if (typeof arguments[arg] != 'object') {
                outStr += arguments[arg];
            }
        }
        return outStr;
    });

    Handlebars.registerHelper('toLowerCase', function (str) {
        return str.toLowerCase();
    });

    Handlebars.registerHelper('localizeSkill', function (str) {
        return game.i18n.localize("CastleFalkenstein.Skill." + str.toLowerCase());
    });

    Handlebars.registerHelper('ifCond', function (v1, v2, options) {
        if (v1 === v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    });	
	
    Handlebars.registerHelper('ifNotCond', function (v1, v2, options) {
        if (v1 === v2) {
            return options.inverse(this);
        }
        return options.fn(this);
    });
	
	Handlebars.registerHelper('ifNotUndefined', function (v1, options) {
        if (!v1) {
			return options.inverse(this);        	
        }
		return options.fn(this);    
		
    });

    const skillToNumberFunction = function (skill) {

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
    };

    Handlebars.registerHelper('skillToNumber', skillToNumberFunction);

});
