/**
 * A specialized Dialog subclass for card dealing
 * @type {Dialog}
 */
export default class PlayerSelectDialog extends Dialog {
  constructor(dialogData={}, options={}) {
    super(dialogData, options);
    this.options.classes = ["castlefalkenstein", "dialog"];    
  }
  
    /* -------------------------------------------- */
  /*  Rendering                                   */
  /* -------------------------------------------- */

  /**

   * Returns a Promise which resolves to the dialog FormData once the workflow has been completed.
   * @param {Item5e} item
   * @return {Promise}
   */
  static async create() {

		var allPlayers = [];
		var allActors = ActorDirectory.collection;
		allActors.forEach( (value, key) => {
		  if (value.data.type === "character")
			{
				allPlayers.push(value);
		}});

    // Render the ability usage template
    const html = await renderTemplate("systems/castlefalkenstein/templates/item/player-select-dialog.html", {
		players : allPlayers,
		currentPlayerName : allPlayers[1].name
    });

    // Create the Dialog and return as a Promise
    return new Promise((resolve) => {
      let formData = null;
      const dlg = new this({
        title: `Choose Player`,
        content: html,
        buttons: {
          use: {
            icon: '<i class="fas fa-fist-raised"></i>',
            label: "Use",
            callback: html => { 
				var result = html[0].querySelector("#maindeck-dealing-dialog");
				formData = new FormData(result);
			}
          }
        },
        default: "use",
        close: () => resolve(formData)
      });
      dlg.render(true);
    });
  }
  
}