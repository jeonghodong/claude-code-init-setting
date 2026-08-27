/* eslint-disable */
/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */
/** @typedef {{}} About_PageInputs */
/** @typedef {{ locale: NonNullable<unknown> }} Current_LocaleInputs */
/** @typedef {{}} Example_MessageInputs */
/** @typedef {{}} Home_PageInputs */
/** @typedef {{}} Language_LabelInputs */
/** @typedef {{}} Learn_RouterInputs */


export const about_page = /** @type {(inputs: About_PageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Über uns`)
};

export const current_locale = /** @type {(inputs: Current_LocaleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Aktuelle Sprache: ${i?.locale}`)
};

export const example_message = /** @type {(inputs: Example_MessageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Willkommen in deiner i18n-App.`)
};

export const home_page = /** @type {(inputs: Home_PageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Startseite`)
};

export const language_label = /** @type {(inputs: Language_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sprache`)
};

export const learn_router = /** @type {(inputs: Learn_RouterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Paraglide JS lernen`)
};