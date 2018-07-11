const React = require('react');
import SVG from 'react-inlinesvg';
import * as d3 from 'd3';

const imageSize = 40;

class Projection extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }
  onLoad(src) {
    const svg = d3.select(this.ref).select('.projection-svg-el svg .container');
    const circle = svg.select('.output-circle');
    const line = svg.select('.output-line');

    // const bottomLine = svg.select('.bottom-line');
    // const rect = bottomLine.node().getBoundingClientRect();
    // const minX = rect.x;
    // const maxX = rect.x + rect.width;
    const minX = 77.5;
    const maxX = 402.35;

    console.log('extent', minX, maxX);
    const x = d3.scaleLinear().domain([4.807568008913199, 235.72559024683454]).range([minX, maxX]);
    const color = d3.scaleLinear().domain([4.807568008913199, 235.72559024683454]).range([0, 255]);

    const cy = +circle.attr('cy');

    const attributeLabels = svg.selectAll('.attribute-labels tspan');

    console.log(attributeLabels);

    const img = svg.append("svg:image").attr('y', cy - imageSize / 2).attr('width', imageSize).attr('height', imageSize);

    let count = 0;
    const images = this.props.images;
    const transition = () => {
      const image = images[count % images.length];
      const r = image['brightness_avg_perceived'];
      console.log('r', r);

      attributeLabels
        .style('fill', '#81daf3')
        .transition()
        .delay(250)
        .duration(1000)
        .style('fill', '#fff');

      img
        .attr("xlink:href", `./static/images/thumbnails/met/${image['Object ID']}.jpg`)
        .transition().duration(1000)
        .attr('x', x(r) - imageSize / 2);

      circle.transition().duration(1000).attr('cx', x(r)).attr('fill', `rgb(${color(r)}, ${color(r)}, ${color(r)})`);
      line.transition().duration(1000).attr('d', `M${x(r)},325.5 L221.5,222.5`);

      count += 1;
      setTimeout(transition, 2000);
    }

    transition();
  }


  render() {
    const { hasError, updateProps, ...props } = this.props;

    return (
      <div ref={(ref) => this.ref = ref}>
        <SVG
          className="projection-svg-el"
          src={props.src}
          onLoad={(src) => {
              this.onLoad(src);
          }} />
      </div>
    );
  }
}

module.exports = Projection;