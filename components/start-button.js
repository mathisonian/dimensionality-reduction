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
  }

  onClick() {
    d3.select('body').style('overflow', 'auto');
    this.props.updateProps({
      state: 'initial'
    });
    this.props.updateProps({ status: 'loading' })
    setTimeout(() => {
      this.props.updateProps({ status: 'loaded' })
    }, 2000);
  }

  render() {
    const { hasError, idyll, status, updateProps, ...props } = this.props;
    if (status === 'initial') {
      return (
        <button onClick={this.onClick.bind(this)} className={'start-button'}>
          Click to Begin
        </button>
      );
    }
    // else if (status === 'loading') {
    //   return <p>Data fetch initiated...</p>;
    // }

    return null;
    // return (
    //   <div style={{ position: 'relative', top: 30, margin: '0 auto', width: '100%', textAlign: 'center' }}>
    //     <p>
    //       Data loading.<br/>Scroll to Continue...
    //     </p>
    //   </div>
    // );
  }
}

module.exports = StartButton;
