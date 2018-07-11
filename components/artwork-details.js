const React = require('react');

class CustomComponent extends React.Component {
  render() {
    const { hasError, idyll, updateProps, artwork, ...props } = this.props;
    if (!artwork) {
      return null;
    }
    return (
      <div style={{position: 'fixed', right: 10, bottom: 10, color: 'white', background: `rgba(0, 0, 0, 0.7)`, padding: 5, fontSize: 10, fontStyle: 'italic'}}>
        {artwork.Title}
      </div>
    );
  }
}

module.exports = CustomComponent;
