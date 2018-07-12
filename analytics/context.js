const Analytics = require('./index');

module.exports = (context) => {

  console.log('initializing context');
  const initialState = context.data();
  const analytics = new Analytics('dimensionality-reduction');
  analytics.onLoad(() => {
    console.log('analytics loaded');
    analytics.updateState(initialState);
    context.onUpdate((newState) => {
      analytics.updateState(newState);
    });
  })
}
