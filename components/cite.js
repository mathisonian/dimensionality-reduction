const React = require('react');
const cite = require('./references').cite;

class Cite extends React.Component {

  renderReference(id) {
    return <a key={id} href={`#reference-${id}`}>{id}</a>;
  }

  renderInner() {
    const reference = this.props.reference;
    if (typeof reference === 'string') {
      return this.renderReference(cite(reference));
    } else if (Array.isArray(reference)) {
      return reference
        .map((r) => this.renderReference(cite(r)))
        .reduce((prev, curr) => [prev, ', ', curr])
    }
  }
  render() {
    const { hasError, idyll, updateProps, ...props } = this.props;
    return (
      <span className="citation">
        <sup>
          [{this.renderInner()}]
        </sup>
      </span>
    );
  }
}

module.exports = Cite;
