// eslint-disable-next-line strict
var path = require('path');
var fs = require('fs');
var fixturesPath = './fixtures';
var inliner = require('css-inline');

global.loadFixtures = function(fileName) {
  var data;
  var dir = path.resolve(__dirname, fixturesPath, fileName);

  try {
    // eslint-disable-next-line no-sync
    data = fs.readFileSync(dir, 'utf8');
    document.body.innerHTML = data;
  } catch (err) {
    document.body.innerHTML = '';
  }
};

global.loadStyleFixtures = function(fileName) {
  var data;
  var dir = path.resolve(__dirname, fixturesPath, fileName);

  try {
    // eslint-disable-next-line no-sync
    data = fs.readFileSync(dir, 'utf8');
    document.body.innerHTML = inliner.inline(
      '<style>' + data + '</style>' + document.body.innerHTML,
      { remove_style_tags: true }
    );
    // eslint-disable-next-line no-empty
  } catch (err) {}
};
