import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import socketIOClient from "socket.io-client";
import CardComponent from './CardComponent';


class TweetList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { items: []};
  }

componentDidMount() {
  const socket = socketIOClient('http://localhost:3000/');

  socket.on('connect', () => {
    console.log("Socket Connected");
    socket.on("tweets", data => {
      console.info(data);
      let newList = [data].concat(this.state.items.slice(0, 15));
      this.setState({ items: newList });
    });
  });
  socket.on('disconnect', () => {
    socket.off("tweets")
    socket.removeAllListeners("tweets");
    console.log("Socket Disconnected");
  });
}


  render() {
    let items = this.state.items;

    let itemsCards = <CSSTransitionGroup
      transitionName="example"
      transitionEnterTimeout={500}
      transitionLeaveTimeout={300}>
      {items.map((x, i) =>
        <CardComponent key={i} data={x} />
      )}
    </CSSTransitionGroup>;

    let loading = <div>
      <p className="flow-text">Listening to Streams</p>
      <div className="progress lime lighten-3">
        <div className="indeterminate pink accent-1"></div>
      </div>
    </div>

    return (
      <div className="row">
        <div className="col s12 m4 l4">
          <div className="input-field col s12">
          </div>
        </div>
        <div className="col s12 m4 l4">
          <div>
            {
              items.length > 0 ? itemsCards : loading
            }

          </div>

        </div>
        <div className="col s12 m4 l4">
        </div>
      </div>
    );
  }
}



export default TweetList;