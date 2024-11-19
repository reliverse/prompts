// @ts-nocheck

const string = require("string-kit");
const term = require("../../src/termkit").terminal;
const Promise = require("seventh");

async function test() {
  var fwa = string.unicode.toFullWidth("@"); // Get a full-width arobas

  term.clear();
  term.moveTo(1, 1, fwa);
  term.moveTo(2, 2, fwa);
  term.moveTo(3, 3, fwa);

  term.moveTo(4, 4, fwa);
  await Promise.resolveTimeout(1000);
  term.moveTo(5, 4, "!");

  term.moveTo(5, 5, fwa);
  await Promise.resolveTimeout(1000);
  term.moveTo(6, 5, "!");

  term.moveTo(1, 10);
  term("Full-width arobas length: %i\n", fwa.length);
  term(
    "Full-width arobas unicode.isFullWidth(): %s\n",
    string.unicode.isFullWidth(fwa),
  );
}

test();