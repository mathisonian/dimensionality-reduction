const React = require('react');
const d3 = require('d3');

class StartButton extends React.Component {

  constructor(props) {
    super(props);
    if (typeof window !== 'undefined') {
      window.onbeforeunload = function(){
        window.scrollTo(0,0);
      };
    }
    this.state = {
      status: 'initial'
    };
  }

  onClick() {
    d3.select('body').style('overflow', 'auto');
    this.props.updateProps({
      state: 'initial'
    });
    this.setState({ status: 'loading' })
    setTimeout(() => {
      this.setState({ status: 'loaded' })
    }, 1500);
  }

  render() {
    const { hasError, idyll, updateProps, ...props } = this.props;
    if (this.state.status === 'initial') {
      return (
        <button onClick={this.onClick.bind(this)} className={'start-button'}>
          Click to Begin.
        </button>
      );
    } else if (this.state.status === 'loading') {
      return null;
    }
    return (
      <div style={{ position: 'relative', top: 30, margin: '0 auto', width: '100%', textAlign: 'center' }}>
        Data loaded.<br/>Scroll to Continue...
      </div>
    );
  }
}

module.exports = StartButton;
