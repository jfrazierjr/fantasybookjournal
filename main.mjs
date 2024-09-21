class FantasyBookJournalModel extends foundry.abstract.TypeDataModel {

	static LOCALIZATION_PREFIXES = ["FantasyBookJournal.path"];

	static defineSchema() {
	const fields = foundry.data.fields;
	return {
	  description: new fields.SchemaField({
		long: new fields.HTMLField({required: false, blank: true}),
		short: new fields.HTMLField({required: false, blank: true})
	  }),
	  img: new fields.FilePathField({required: false, categories: ["IMAGE"]}),
      steps: new fields.ArrayField(new fields.StringField({blank: true}))
	};
	}

  prepareDerivedData() {
    this.nSteps = this.steps.length;
  }
}

class FantasyBookJournalPageSheet extends JournalTextPageSheet {
  get template() {
    return `modules/fantasy-book-journal/templates/fantasy-book-journal-sheet-${this.isEditable ? "edit" : "view"}.html`;
  }

  async getData(options={}) {
    const context = await super.getData(options);
    context.description = {
      long: await TextEditor.enrichHTML(this.object.system.description.long, {
        async: true,
        secrets: this.object.isOwner,
        relativeTo: this.object
      }),
      short: await TextEditor.enrichHTML(this.object.system.description.short, {
        async: true,
        secrets: this.object.isOwner,
        relativeTo: this.object
      })
    };
    return context;
  }
}

Hooks.on("init", () => {
  Object.assign(CONFIG.JournalEntryPage.dataModels, {
    "fantasy-book-journal.bookpage": FantasyBookJournalModel
  });
});

Hooks.on("init", () => {
  DocumentSheetConfig.registerSheet(JournalEntryPage, "fantasy-book-journal", FantasyBookJournalPageSheet, {
    types: ["fantasy-book-journal.bookpage"],
    makeDefault: true
  });
});