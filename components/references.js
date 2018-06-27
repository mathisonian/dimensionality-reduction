const React = require('react');
const parse = require('bibtex-parser')

// need to load in .bib file directly as a string
let bibliography = "@inproceedings{test1,\
 author = {Lysenko, Mikola and Nelaturi, Saigopal and Shapiro, Vadim},\
 title = {Group morphology with convolution algebras},\
 booktitle = {Proceedings of the 14th ACM Symposium on Solid and Physical Modeling},\
 series = {SPM '10},\
 year = {2010},\
 isbn = {978-1-60558-984-8},\
 location = {Haifa, Israel},\
 pages = {11--22},\
 numpages = {12},\
 url = {http://doi.acm.org/10.1145/1839778.1839781},\
 doi = {10.1145/1839778.1839781},\
 acmid = {1839781},\
 publisher = {ACM},\
 address = {New York, NY, USA},\
}\
@inproceedings{test2, \
  author = { Lysenko, Mikola and Nelaturi, Saigopal and Shapiro, Vadim }, \
  title = { Group morphology with convolution algebras }, \
  booktitle = { Proceedings of the 14th ACM Symposium on Solid and Physical Modeling }, \
  series = {\
    SPM '10},\
 year = {2010},\
 isbn = {978-1-60558-984-8},\
 location = {Haifa, Israel},\
 pages = {11--22},\
 numpages = {12},\
 url = {http://doi.acm.org/10.1145/1839778.1839781},\
 doi = {10.1145/1839778.1839781},\
 acmid = {1839781},\
 publisher = {ACM},\
 address = {New York, NY, USA},\
}";

console.log(parse(bibliography));

class References extends React.Component {

  createReferences() {
    console.log(Object.keys(bibliography))
  };

  render() {
    const { hasError, idyll, updateProps, ...props } = this.props;
    return (
      <div {...props}>
        {this.createReferences()}
      </div>
    );
  }
}

module.exports = References;
