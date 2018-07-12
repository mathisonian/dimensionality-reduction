const React = require('react');
const parse = require('bibtex-parser')
import bibliography from './bib.js'

const citationCache = {};
const cite = (label) => {
  return citationCache[label.toUpperCase()];
}

const parsedBib = parse(bibliography);

Object.keys(parsedBib).forEach((key, i) => {
  citationCache[key.toUpperCase()] = i + 1;
});

class References extends React.Component {

  createReference(reference, i) {
    return (
      <li id={`reference-${i + 1}`} key={reference.TITLE} className={'reference'}>
        <span className={'reference-title'}>{reference.TITLE}.</span>
        <br />
        {reference.AUTHOR}.
        <br />
        <i>{reference.JOURNAL}, {reference.YEAR}.</i>
      </li>
    )
  }

  createReferences() {
    return Object.keys(parsedBib)
      .map((key, i) => {
        const reference = parsedBib[key];
        return this.createReference(reference, i);
      });
  };

  render() {
    const { hasError, idyll, updateProps, ...props } = this.props;
    return (
      <div {...props}>
        <h3>References</h3>
        <ol>
          {this.createReferences()}
        </ol>
      </div>
    );
  }
}

References.cite = cite;

module.exports = References;
