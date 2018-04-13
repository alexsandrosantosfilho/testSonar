import { BackOfficeFrontPage } from './app.po';

describe('back-office-front App', () => {
  let page: BackOfficeFrontPage;

  beforeEach(() => {
    page = new BackOfficeFrontPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
