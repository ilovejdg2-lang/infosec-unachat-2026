var expect = require('chai').expect;

describe('pipeline block demonstration', function () {
  it('fails on purpose so the deploy job is skipped', function () {
    expect(false, 'temporary failure used only to prove the pipeline blocks deploy').to.equal(true);
  });
});
