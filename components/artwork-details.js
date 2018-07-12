const React = require('react');
const IMAGE_BASE = 'https://d1qh62yyj9qkpe.cloudfront.net';

class CustomComponent extends React.Component {
  render() {
    const { hasError, idyll, updateProps, artwork, ...props } = this.props;
    if (!artwork) {
      return null;
    }
    return (
      <div style={{position: 'fixed', right: 25, bottom: 10, fontSize: 10, textAlign: 'right', maxWidth: 600, pointerEvents: 'none'}}>
        <img src={`${IMAGE_BASE}/met/${artwork['Object ID']}.jpg`} style={{maxHeight: 200, maxWidth: 600}} />
        <div style={{
            color: 'white',
            // color: '#1E467E',
            // background: `rgba(0, 0, 0, 0.7)`,
            // background: 'hsl(49, 98%, 84%)',
            maxWidth: 400,
            background: '#222222',
            textAlign: 'left',
            padding: 5}}>
          {artwork['Title']} ({artwork['Object End Date']})<br/>
          {artwork['Artist Display Name']}
        </div>
      </div>
    );
  }
}

module.exports = CustomComponent;
