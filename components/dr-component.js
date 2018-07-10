const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');
const H = require('hilbert');
const Path = require('svg-path-generator');

const size = 600;

const jitter = (d) => {
  // return d;
  return d + 20 * (Math.random() - 0.5);
}

const brightnessKey = 'brightness_avg_perceived';


class DRComponent extends D3Component {

  initialize(node, props) {
    this.width = node.getBoundingClientRect().width;
    this.height = window.innerHeight;

    const images = props.images.filter((d) => Math.random() > 0.5);

    const svg = this.svg = d3.select(node).append('svg');
    svg.attr('viewBox', `0 0 ${this.width} ${this.height}`)
      .style('width', '100%')
      .style('height', 'auto')
      .style('overflow', 'visible')
      // .style('background', 'white')
      // .style('max-height', '100vh');


    const $elements = svg.selectAll('.element')
      .data(images.map((d) => {
        return Object.assign({_seed: Math.random()}, d);
      }))

    const $el = $elements.enter()
        .append('g')
        .attr('transform', () => `translate(${Math.random() * this.width}, ${Math.random() * this.height})`)
        .classed('element', true);


    this.$el = $el;
    this.$elements = $elements;


    this.weightKeys = Object.keys(props.weights);
    const _scaleCache = [];
    this.weightKeys.forEach((key) => {
      _scaleCache[key] = d3.scaleLinear().domain(d3.extent(images, (d) => d[key]));
    })

    this.normalizeVar = (d, key) => {
      return _scaleCache[key](d[key]);
    }


    this.brightness = d3.scaleLinear().domain(d3.extent(images, (d) => d[brightnessKey])).range([0, this.width - this.width / 30]);


    const scale = 0.66;
    const HILBERT_SIZE = 4;
    const _hilbertNormalize = d3.scaleLinear().domain([0, 1]).range([0, Math.pow(HILBERT_SIZE, 4)]);
    const _hilbert = new H.Hilbert2d(HILBERT_SIZE);

    const hilbertG = svg.append('g').attr('transform', `translate(${scale / Math.pow(HILBERT_SIZE, 2) / 2 * this.width}, ${scale / Math.pow(HILBERT_SIZE, 2) / 2 * this.height})`)

    let hilbertPath = Path();
    d3.range(Math.pow(HILBERT_SIZE, 4)).forEach((i) => {
      const hilbertOut = _hilbert.xy(i);
      const cx = (hilbertOut.x / Math.pow(2, HILBERT_SIZE)) * scale * this.width + (1 - scale) / 2 * this.width;
      const cy = (hilbertOut.y / Math.pow(2, HILBERT_SIZE)) * scale * this.height + (1 - scale) / 2 * this.height;
      if (i === 0) {
        hilbertPath.moveTo(cx, cy);
      } else {
        hilbertPath.lineTo(cx, cy);
      }
    })

    const hPath = hilbertG.append('path').attr('d', hilbertPath).attr('fill', 'none').attr('stroke', 'none').node();


    const _pathLength = hPath.getTotalLength();
    this.hilbert = (d) => {

      const hilbertOut = hPath.getPointAtLength(_pathLength * d);

      const scale = 0.66;
      const xOffset = scale / Math.pow(HILBERT_SIZE, 2) / 2 * this.width;
      const yOffset = scale / Math.pow(HILBERT_SIZE, 2) / 2 * this.height;
      return {
        x: xOffset + hilbertOut.x,
        y: yOffset + hilbertOut.y
      }
    }

    this.$images = this.$el.append("svg:image")
      .attr('x', (d) => {
        return -1 * this.normalizeVar(d, 'Width (cm)') * this.width / 10 / 2;
      })
      .attr('y', (d) => {
        return -1 * this.normalizeVar(d, 'Height (cm)') * this.height / 10 / 2;
      })
      .attr('width', (d) => {
        return this.normalizeVar(d, 'Width (cm)') * this.width / 10;
      })
      .attr('height', (d) => {
        return this.normalizeVar(d, 'Height (cm)') * this.height / 10;
      })
      .on('mouseenter', (d, i, nodes) => {
        console.log('mouseenter');
        // TODO - move node's parent to front

        d3.select(nodes[i])
        .attr('x', (d) => {
          return -1 * this.normalizeVar(d, 'Width (cm)') * this.width / 5 * 3;
        })
        .attr('y', (d) => {
          return -1 * this.normalizeVar(d, 'Height (cm)') * this.height / 5 * 3;
        })
        .attr('width', (d) => {
          return this.normalizeVar(d, 'Width (cm)') * this.width / 5 * 6;
        })
        .attr('height', (d) => {
          return this.normalizeVar(d, 'Height (cm)') * this.height / 5 * 6;
        })
      })
      .on('mouseleave', (d, i, nodes) => {
        console.log('mouseleave');
        d3.select(nodes[i])
          .attr('x', (d) => {
            return -1 * this.normalizeVar(d, 'Width (cm)') * this.width / 5 / 2;
          })
          .attr('y', (d) => {
            return -1 * this.normalizeVar(d, 'Height (cm)') * this.height / 5 / 2;
          })
          .attr('width', (d) => {
            return this.normalizeVar(d, 'Width (cm)') * this.width / 5;
          })
          .attr('height', (d) => {
            return this.normalizeVar(d, 'Height (cm)') * this.height / 5;
          })
      })
      .style('opacity', 0)
      .attr("xlink:href", (d) => d.ThumbnailURL);



    // d3.range(0, 1, 0.001).forEach((d) => {
    //   const h = this.hilbert(d);
    //   svg.append('circle')
    //     .attr('cx', h.x)
    //     .attr('cy', h.y)
    //     .attr('r', 5)
    // })
  }

  _updateHilbert(props) {
    let max = 0;
    let min = 0;
    let weights = [];
    this.$el
      .each((d) => {

        const _weighted = this.weightKeys.reduce((memo, key, i) => {
          return memo + props.weights[key] * this.normalizeVar(d, key);
        }, 0) / this.weightKeys.reduce((memo, key, i) => {
          return memo + props.weights[key];
        }, 0);

        if (_weighted > max) {
          max = _weighted;
        }
        if (_weighted < min) {
          min = _weighted;
        }
        weights.push(_weighted);
      });

    console.log(max);
    this.$el
      // .transition()
      // .duration(1000)
      .attr('transform', (d, i) => {
        const { x, y } = this.hilbert(min + weights[i] / (max - min));
        return  `translate(${jitter(x)}, ${jitter(y)})`;
      })
  }

  update(props) {
    if (props.state !== this.props.state) {
      switch(props.state) {
        case 'initial':

          console.log('initial.....');
          this.$rects = this.$el.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', 0)
            .attr('height', 0)
            .style('fill', '#fff');

          this.$rects
            .transition()
            .duration(1000)
            // .delay(100)
            // .delay((d, i) => 100 + (i + 10) * 30 + (Math.random() - 0.5) * 30)
            .delay((d, i) => 50 + 25 * Math.random() + i * 5)
            .ease(d3.easeElasticOut)
            .attr('x', (d) => {
              return -1 * this.normalizeVar(d, 'Width (cm)') * this.width / 10 / 2;
            })
            .attr('y', (d) => {
              return -1 * this.normalizeVar(d, 'Height (cm)') * this.height / 10 / 2;
            })
            .attr('width', (d) => {
              return this.normalizeVar(d, 'Width (cm)') * this.width / 10;
            })
            .attr('height', (d) => {
              return this.normalizeVar(d, 'Height (cm)') * this.height / 10;
            })
            // .on('end', () => {
            //     // `./static/images/${d.AccessionNumber}.jpg`)
            // });

          break;

        case 'reveal':

          this.$images.style('opacity', 1);
          this.$rects
            .transition()
            .delay((d, i) => 50 + 25 * Math.random() + i * 5)
            .duration(1000)
            .style('opacity', 0)
            .on('end', function() {
              d3.select(this).remove();
            })
          break;
        case '1d':
          this.$el
              .transition()
              .duration(1000)
              .attr('transform', (d) => `translate(${jitter(this.brightness(d[brightnessKey]))}, ${jitter(this.height / 2 - this.height / 30 / 2)})` );
          break;
        case 'reset':
          this.$el
            .transition()
            .duration(1000)
            .attr('transform', () => `translate(${Math.random() * this.width}, ${Math.random() * this.height})`)
          break;
        case 'hilbert-brightness':
          this.$el
            .transition()
            .duration(1000)
            .attr('transform', (d) => {
              const { x, y } = this.hilbert(this.normalizeVar(d, brightnessKey));
              return  `translate(${jitter(x)}, ${jitter(y)})`;
            })
          break;
        case 'hilbert-custom':
          this._updateHilbert(props);
          break;
        default:
          break;
      }
    } else if (props.state.indexOf('hilbert') > -1) {
      this._updateHilbert(props);
    }


  }
}

module.exports = DRComponent;
