const React = require('react');

class CustomComponent extends React.Component {
  render() {
    const { hasError, idyll, updateProps, artwork, ...props } = this.props;
    if (!artwork) {
      return null;
    }
    return (
      <div style={{position: 'fixed', right: 25, bottom: 10, color: 'white', background: `rgba(0, 0, 0, 0.7)`, padding: 5, fontSize: 10, fontStyle: 'italic', textAlign: 'right'}}>
        {artwork['Title']} ({artwork['Object End Date']} )<br/>
        {artwork['Artist Display Name']}
      </div>
    );
  }
}

module.exports = CustomComponent;
