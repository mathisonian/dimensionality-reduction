const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const size = 600;

class DRComponent extends D3Component {

  initialize(node, props) {

    const data = d3.range(200).map((i) => i);

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    const svg = this.svg = d3.select(node).append('svg');
    svg.attr('viewBox', `0 0 ${this.width} ${this.height}`)
      .style('width', '100%')
      .style('height', 'auto')
      // .style('max-height', '100vh');


    const $elements = svg.selectAll('.element')
      .data(data)

    const $el = $elements.enter()
        .append('g')
        .classed('element', true);

    this.$circles = $el.append('circle')
        .attr('r', 5)
        .attr('cx', () => Math.random() * this.width)
        .attr('cy', () => Math.random() * this.height);

    this.$elements = $elements;
  }

  update(props) {

    console.log(props);
    if (props.state !== this.props.state) {

      switch(props.state) {
        case 'initial':
          this.$circles
            .transition()
            .attr('cx', () => Math.random() * this.width)
            .attr('cy', () => Math.random() * this.height);
          break;
        case '1d':
          this.$circles
              .transition()
              .attr('cy', () => this.height / 2);
          break;

        case 'pca-1':
          this.$circles
            .transition()
            .attr('cx', () => Math.random() * this.width)
            .attr('cy', () => Math.random() * this.height);
          break;
        default:
          break;
      }
    }
  }
}

module.exports = DRComponent;
